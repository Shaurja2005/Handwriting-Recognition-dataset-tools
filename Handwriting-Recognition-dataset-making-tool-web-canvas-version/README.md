
# Handwriting Recognition Dataset Making Tool (Web Canvas Version)

This project is a web-based drawing canvas for creating and labelling handwriting samples, designed for building datasets for handwriting recognition. Built from scratch using HTML, CSS, and JavaScript, it allows users to draw freely, label their drawings, and export the data as structured JSON files for machine learning or analysis.

## Features
- Draw on the canvas using your mouse
- Adjust the width of the lines dynamically with the mouse wheel (width: 1-10)
- Label each drawing before saving
- Download your drawing and its metadata as a JSON file
- Each JSON file contains stroke data, label, timestamp, and canvas size
- Clean and minimal UI
- No external libraries or frameworks


## How to Use
1. Click and drag your mouse on the canvas to draw.
2. Use the mouse wheel to increase or decrease the width of the lines as you draw.
3. Click **CLEAR ALL** or **c letter** to reset the canvas and start over.
4. When finished, click **DOWNLOAD JSON** or the **v letter**. Enter a label (e.g., "5", "plus", "x") when prompted.
5. The drawing and its metadata will be saved as a JSON file, ready for use in dataset creation.


## File Structure
- `index.html` — Main HTML file containing the canvas and controls
- `main.js` — JavaScript logic for drawing, labeling, and exporting JSON
- `styles.css` — Basic styling for the canvas and page


## Getting Started
No installation is required. Simply open the `index.html` file in any modern web browser.


## JSON Dataset Format
Each downloaded JSON file contains:

- `label`: The label you provide for the drawing
- `timestamp`: When the drawing was saved
- `canvasWidth`, `canvasHeight`: Size of the canvas
- `strokes`: Array of strokes, each stroke is an array of points `{x, y, t}` (with `t` as time since drawing started)

Example:
```json
{
	"label": "5",
	"timestamp": 1700000000000,
	"canvasWidth": 1920,
	"canvasHeight": 1080,
	"strokes": [
		[ { "x": 100, "y": 200, "t": 0 }, ... ],
		[ { "x": 120, "y": 220, "t": 50 }, ... ]
	]
}
```

## Author
Created by Sauryadipta Bhattacharya

