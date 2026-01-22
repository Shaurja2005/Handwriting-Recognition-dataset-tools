# Handwriting Dataset Maker Tool

This tool allows users to create a handwriting dataset by capturing (x, y) coordinates as they draw. The dataset can be downloaded in JSON format for use in machine learning, data analysis, or other projects involving handwriting recognition.

## Features
- Draw and record handwriting as a series of (x, y) coordinates
- Save and download your dataset as a JSON file
- Simple and intuitive interface
- Ctrl+Z can do undo and Enter key can enter the data

## How It Works
1. **Draw**: Use the tool to draw characters, digits, or shapes. The tool records the (x, y) coordinates of your strokes.
2. **Save**: Once finished, you can save your drawing session.
3. **Download**: Export your dataset as a JSON file, which contains the recorded (x, y) coordinates.

## JSON Format Example
```
[
  { "label": "A", "coordinates": [[10, 20], [11, 21], ...] },
  { "label": "B", "coordinates": [[15, 25], [16, 26], ...] }
]
```
- Each entry contains a `label` (e.g., the character drawn) and a list of (x, y) `coordinates`.

## Usage
1. Run the tool:
   ```
   python game.py
   ```
2. Follow the on-screen instructions to draw and save your handwriting samples.
3. Download the dataset as a JSON file when prompted.

## Requirements
- Python 3.x
- Any additional dependencies listed in your project (if any)

## License
This project is licensed under the MIT License