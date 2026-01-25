import tkinter as tk
from tkinter import messagebox
import json
import os
import time
import uuid

# Configuration
OUTPUT_FILE = "dataset.json"

class DataCollectorApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Handwritten Math Data Collector")
        self.root.state('zoomed')
        
        # Data storage
        self.current_strokes = []  # List of all strokes
        self.current_stroke = []   # Current single stroke (while dragging)
        
        # UI Setup
        self._setup_ui()
        
        # Bindings
        self.canvas.bind("<Button-1>", self.start_stroke)
        self.canvas.bind("<B1-Motion>", self.record_point)
        self.canvas.bind("<ButtonRelease-1>", self.end_stroke)
        self.root.bind("<Return>", self.save_data)  
        self.root.bind("<Control-z>", self.undo_stroke)

    def _setup_ui(self):
        # 1. Top Control Panel
        control_frame = tk.Frame(self.root)
        control_frame.pack(fill=tk.X, padx=5, pady=5)
        
        tk.Label(control_frame, text="Label (Latex):", font=("Arial", 12)).pack(side=tk.LEFT)
        
        self.label_entry = tk.Entry(control_frame, font=("Arial", 14), width=20)
        self.label_entry.pack(side=tk.LEFT, padx=10, expand=True, fill=tk.X)
        self.label_entry.focus_set()  # Ready to type immediately
        
        save_btn = tk.Button(control_frame, text="Save (Enter)", bg="#4CAF50", fg="white", command=self.save_data)
        save_btn.pack(side=tk.LEFT, padx=5)
        
        clear_btn = tk.Button(control_frame, text="Clear", command=self.clear_canvas)
        clear_btn.pack(side=tk.LEFT, padx=5)

        # 2. Drawing Canvas
        # Dynamic screen size
        screen_width = self.root.winfo_screenwidth()
        screen_height = self.root.winfo_screenheight()
        self.canvas = tk.Canvas(self.root, width=screen_width, height=screen_height, bg="white", cursor="cross")
        self.canvas.pack(pady=10, padx=10)
        
        # 3. Status Bar
        self.status_label = tk.Label(self.root, text="Ready. Draw and type label.", bd=1, relief=tk.SUNKEN, anchor=tk.W)
        self.status_label.pack(side=tk.BOTTOM, fill=tk.X)

    # Drawing Logic
    def start_stroke(self, event):
        self.current_stroke = []
        self.current_stroke.append([event.x, event.y])

    def record_point(self, event):
        # Add point to data
        self.current_stroke.append([event.x, event.y])
        
        if len(self.current_stroke) > 1:
            x1, y1 = self.current_stroke[-2]
            x2, y2 = self.current_stroke[-1]
            self.canvas.create_line(x1, y1, x2, y2, width=3, capstyle=tk.ROUND, smooth=True)

    def end_stroke(self, event):
        if len(self.current_stroke) > 1:
            self.current_strokes.append(self.current_stroke)

    def undo_stroke(self, event=None):
        if not self.current_strokes:
            return
        
        # Remove last stroke from data
        self.current_strokes.pop()
        
        # Redraw canvas
        self.canvas.delete("all")
        for stroke in self.current_strokes:
            if len(stroke) > 1:
                flat_points = [coord for point in stroke for coord in point]
                self.canvas.create_line(flat_points, width=3, capstyle=tk.ROUND, smooth=True)

    def clear_canvas(self):
        self.canvas.delete("all")
        self.current_strokes = []
        self.label_entry.delete(0, tk.END)

    # Save Logic
    def save_data(self, event=None):
        label_text = self.label_entry.get().strip()
        
        # Validation
        if not label_text:
            messagebox.showwarning("Missing Label", "Please type a label (e.g., '2' or 'x')")
            return
        if not self.current_strokes:
            messagebox.showwarning("Missing Drawing", "Please draw something on the canvas.")
            return

        # Prepare Data Entry
        data_entry = {
            "id": str(uuid.uuid4()),
            "timestamp": time.time(),
            "label": label_text,
            "strokes": self.current_strokes
        }

        # Save to JSON File
        try:
            # Read existing data or create new list
            if os.path.exists(OUTPUT_FILE):
                with open(OUTPUT_FILE, "r") as f:
                    try:
                        data = json.load(f)
                    except json.JSONDecodeError:
                        data = []
            else:
                data = []

            data.append(data_entry)

            with open(OUTPUT_FILE, "w") as f:
                json.dump(data, f, indent=2)

            # Success Feedback
            print(f"Saved: {label_text} ({len(self.current_strokes)} strokes)")
            self.status_label.config(text=f"Saved '{label_text}'! Total samples: {len(data)}")
            
            # Reset for next entry
            self.clear_canvas()
            
        except Exception as e:
            messagebox.showerror("Error", f"Failed to save data: {e}")

if __name__ == "__main__":
    root = tk.Tk()
    app = DataCollectorApp(root)
    root.mainloop()