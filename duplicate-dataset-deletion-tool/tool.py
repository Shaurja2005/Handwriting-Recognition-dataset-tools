import os
import json
import hashlib

def remove_duplicate_drawings(dataset_folder):
    print(f"Scanning folder: {dataset_folder}...\n")
    
    seen_fingerprints = set()
    deleted_count = 0
    scanned_count = 0
    
    # Loop through all files in the folder
    for filename in os.listdir(dataset_folder):
        if not filename.endswith(".json"):
            continue
            
        filepath = os.path.join(dataset_folder, filename)
        scanned_count += 1
        
        try:
            # Open and read the JSON file
            with open(filepath, "r", encoding="utf-8") as f:
                data = json.load(f)
                
            # Extract the actual drawing data
            strokes = data.get("strokes", [])
            
            # Convert the strokes list into a standardized string
            strokes_string = json.dumps(strokes, sort_keys=True)
            
            # Create a unique MD5 hash (fingerprint) of the drawing
            fingerprint = hashlib.md5(strokes_string.encode('utf-8')).hexdigest()
            
            # Check if we have seen this exact drawing before
            if fingerprint in seen_fingerprints:
                # It's a duplicate! Delete the file.
                os.remove(filepath)
                deleted_count += 1
                print(f"🗑️ Deleted duplicate: {filename}")
            else:
                # It's a brand new drawing. Remember its fingerprint.
                seen_fingerprints.add(fingerprint)
                
        except json.JSONDecodeError:
            print(f"⚠️ Error: {filename} is corrupted or not valid JSON.")
        except Exception as e:
            print(f"⚠️ Error processing {filename}: {e}")

    # Print the final summary
    kept_count = scanned_count - deleted_count
    print("\n" + "="*30)
    print("🧹 CLEANUP COMPLETE")
    print("="*30)
    print(f"Total files scanned:   {scanned_count}")
    print(f"Duplicates deleted:    {deleted_count}")
    print(f"Unique files kept:     {kept_count}")

# --- HOW TO USE ---
# Change this path to wherever your JSON files are stored!
# Example: folder_path = "C:/Users/YourName/Desktop/Dataset"
folder_path = "./"  # Use "./" if the script is in the same folder as the JSONs

remove_duplicate_drawings(folder_path)