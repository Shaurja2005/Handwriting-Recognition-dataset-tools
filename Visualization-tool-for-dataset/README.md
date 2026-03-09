# Training Data Visualizer

A lightweight web-based tool designed to visualize dataset samples stored in JSON format. It parses stroke data and renders it onto a canvas, allowing users to verify labeling, stroke order, and data integrity.

## Features

- **JSON File Upload**: Locally upload `.json` data files directly in the browser.
- **Stroke Visualization**: Renders vector strokes on a 500x500 canvas.
- **Stroke Order Color Coding**:
  - **Red**: First stroke (Start)
  - **Blue**: Second stroke
  - **Black**: Subsequent strokes
  - *This helps in identifying connection errors or stroke ordering issues.*
- **Metadata Display**: Shows details extracted from the file:
  - Label / Class
  - Timestamp (converted to readable local date)
  - Original Resolution
  - Total Stroke Count
- **Responsive Scaling**: Automatically scales the drawing coordinates to fit the viewer's canvas size regardless of the original recording resolution.

## How to Use

1. Clone or download this repository.
2. Open `index.html` in any modern web browser.
3. Click the **Choose File** button.
4. Select a valid JSON dataset file.
5. The visualization and metadata will appear instantly.

## Expected JSON Format

The tool expects a JSON file with the following structure:

```json
{
  "label": "String",
  "timestamp": 1234567890,
  "canvasWidth": 1920,
  "canvasHeight": 1080,
  "strokes": [
    [{"x": 10, "y": 10}, {"x": 20, "y": 20}], 
    [{"x": 30, "y": 30}, {"x": 40, "y": 40}] 
  ]
}
```

## Technologies Used

- **HTML5**: Structure and Layout.
- **CSS3**: Styling for a clean, centered interface.
- **JavaScript (Vanilla)**: File parsing (FileReader API), Canvas 2D rendering logic, and DOM manipulation.

## Project Structure

- `index.html`: Main entry point and UI layout.
- `script.js`: functionality for file handling, JSON parsing, and canvas drawing.
- `style.css`: Styles for the container, canvas, and info box.
