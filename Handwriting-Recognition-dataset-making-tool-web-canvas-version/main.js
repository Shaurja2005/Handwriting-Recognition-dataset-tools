const canvas = document.getElementById("graphics");
const ctx = canvas.getContext("2d");
const clearBtn = document.getElementById("clearBTN");
const downloadBtn = document.getElementById("downloadBTN");
ctx.lineJoin = "round";

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let isClicked = false;
let lineWidth = 10;
let temp = null;
let strokes = [];
let currentStroke = [];
let drawingStartTime = null; 

function reportWindowSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", reportWindowSize);

canvas.addEventListener("mousedown", (event) => {
  if (event.button === 0 && !isClicked) {
    isClicked = true;
    temp = [event.offsetX, event.offsetY];
    
    if (drawingStartTime === null) {
      drawingStartTime = performance.now();
    }
    
    currentStroke = [];
    const t = Math.round(performance.now() - drawingStartTime);
    currentStroke.push({ x: event.offsetX, y: event.offsetY, t: t });
  }
});

canvas.addEventListener("mouseup", (event) => {
  if (event.button === 0 && isClicked) {
    isClicked = false;
    temp = null;
    
    if (currentStroke.length > 0) {
      strokes.push(currentStroke);
      currentStroke = [];
    }
  }
});

canvas.addEventListener("mouseleave", () => {
  if (isClicked) {
    isClicked = false;
    temp = null;
    
    // Save the stroke when leaving canvas
    if (currentStroke.length > 0) {
      strokes.push(currentStroke);
      currentStroke = [];
    }
  }
});

canvas.addEventListener("mousemove", (event) => {
  if (isClicked && temp) {
    ctx.beginPath();
    ctx.lineCap = "round";
    ctx.moveTo(temp[0], temp[1]);
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    temp = [event.offsetX, event.offsetY];
    
    const t = Math.round(performance.now() - drawingStartTime);
    currentStroke.push({ x: event.offsetX, y: event.offsetY, t: t });
  }
});

canvas.addEventListener("wheel", (event) => {
  if (event.deltaY > 0 && lineWidth > 1) {
    lineWidth--;
  } else if (event.deltaY < 0 && lineWidth < 10) {
    lineWidth++;
  }
});

clearBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  strokes = [];
  currentStroke = [];
  drawingStartTime = null;
  console.log("Canvas and strokes cleared");
});

// Download button: saves strokes as JSON file
downloadBtn.addEventListener("click", () => {
  if (strokes.length === 0 && currentStroke.length === 0) {
    alert("No drawing data to save. Please draw something first.");
    return;
  }
  
  const label = prompt("Enter a label for this drawing (e.g., '5', 'plus', 'x'):");
  
  if (label === null || label.trim() === "") {
    alert("Download cancelled. A label is required.");
    return;
  }
  
  const sanitizedLabel = label.trim().replace(/[^a-zA-Z0-9_-]/g, "_");
  const timestamp = Date.now();
  const filename = `${sanitizedLabel}_${timestamp}.json`;
  
  // Include any in-progress stroke
  const allStrokes = currentStroke.length > 0 
    ? [...strokes, currentStroke] 
    : strokes;
  
  const data = {
    label: label.trim(),
    timestamp: timestamp,
    canvasWidth: canvas.width,
    canvasHeight: canvas.height,
    strokes: allStrokes
  };
  
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  console.log(`Downloaded: ${filename} with ${allStrokes.length} strokes`);
});