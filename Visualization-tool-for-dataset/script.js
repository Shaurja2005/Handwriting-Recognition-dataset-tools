const fileInput = document.getElementById("fileInput");
const gallery = document.getElementById("gallery");
const emptyMsg = document.getElementById("emptyMsg");
const resetBtn = document.getElementById("resetBtn");

// In-memory list of loaded entries: { filename, data }
let loadedFiles = [];

// Allow re-selecting the same files by resetting the input value after use
fileInput.addEventListener("change", (event) => {
  const files = Array.from(event.target.files);
  if (files.length === 0) return;

  let pending = files.length;

  files.forEach((file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        loadedFiles.push({ filename: file.name, data });
      } catch (err) {
        alert(`Error parsing "${file.name}": ${err.message}`);
      } finally {
        pending--;
        if (pending === 0) renderGallery();
      }
    };

    reader.readAsText(file);
  });

  // Reset so the same file can be re-added later if needed
  fileInput.value = "";
});

// Reset button handler
resetBtn.addEventListener("click", () => {
  loadedFiles = [];
  renderGallery();
});

function renderGallery() {
  gallery.innerHTML = "";

  if (loadedFiles.length === 0) {
    emptyMsg.style.display = "block";
    resetBtn.style.display = "none";
    return;
  }

  emptyMsg.style.display = "none";
  resetBtn.style.display = "inline-block";

  loadedFiles.forEach((entry, index) => {
    const card = createCard(entry, index);
    gallery.appendChild(card);
  });
}

function createCard(entry, index) {
  const { filename, data } = entry;

  // Card wrapper
  const card = document.createElement("div");
  card.className = "card";

  // ── Header: filename + delete button ──
  const header = document.createElement("div");
  header.className = "card-header";

  const nameEl = document.createElement("span");
  nameEl.className = "card-filename";
  nameEl.textContent = filename;

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => {
    loadedFiles.splice(index, 1);
    renderGallery();
  });

  header.appendChild(nameEl);
  header.appendChild(deleteBtn);
  card.appendChild(header);

  // ── Canvas ──
  const CANVAS_SIZE = 300;
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  card.appendChild(canvas);

  // Draw after appending so the canvas is ready
  drawStrokesOnCanvas(canvas, data);

  // ── Metadata ──
  const info = document.createElement("div");
  info.className = "card-info";
  const date = new Date(data.timestamp).toLocaleString();
  info.innerHTML = `
        <strong>Label:</strong> ${escapeHTML(String(data.label))}<br>
        <strong>Date:</strong> ${escapeHTML(date)}<br>
        <strong>Original Resolution:</strong> ${data.canvasWidth} x ${data.canvasHeight} px<br>
        <strong>Stroke Count:</strong> ${data.strokes.length}
    `;
  card.appendChild(info);

  return card;
}

function drawStrokesOnCanvas(canvas, data) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const scaleX = canvas.width / data.canvasWidth;
  const scaleY = canvas.height / data.canvasHeight;

  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  data.strokes.forEach((stroke, index) => {
    if (stroke.length === 0) return;

    ctx.beginPath();

    // Color code: 1st stroke Red, 2nd Blue, rest Black.
    if (index === 0) ctx.strokeStyle = "red";
    else if (index === 1) ctx.strokeStyle = "blue";
    else ctx.strokeStyle = "black";

    ctx.moveTo(stroke[0].x * scaleX, stroke[0].y * scaleY);

    for (let i = 1; i < stroke.length; i++) {
      ctx.lineTo(stroke[i].x * scaleX, stroke[i].y * scaleY);
    }

    ctx.stroke();
  });
}

// Prevent XSS when injecting user-supplied strings into innerHTML
function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
