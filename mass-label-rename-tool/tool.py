import os
import json

folder_path = r"E:\projects\Handwritten-Mathematical-equation-solver\cleaned-dataset\Variables\sym(x)"   # folder containing the JSON files

for filename in os.listdir(folder_path):
    if filename.endswith(".json"):
        path = os.path.join(folder_path, filename)

        with open(path, "r") as f:
            data = json.load(f)

        data["label"] = r"x"

        with open(path, "w") as f:
            json.dump(data, f, indent=2)

print("All labels updated.")

