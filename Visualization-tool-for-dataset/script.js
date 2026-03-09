const canvas = document.getElementById("visCanvas");
const ctx = canvas.getContext("2d");
const fileInput = document.getElementById("fileInput");
const infoBox = document.getElementById("infoBox");

fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    // When file is read, parse and draw
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            displayMetadata(data);
            drawFromJSON(data);
        } catch (error) {
            alert("Error parsing JSON: " + error.message);
        }
    };

    reader.readAsText(file);
});

function displayMetadata(data) {
    infoBox.style.display = "block";
    
    // Formatting the timestamp into a readable date
    const date = new Date(data.timestamp).toLocaleString();
    
    infoBox.innerHTML = `
        <strong>Label:</strong> ${data.label}<br>
        <strong>Date:</strong> ${date}<br>
        <strong>Original Resolution:</strong> ${data.canvasWidth} x ${data.canvasHeight} px<br>
        <strong>Stroke Count:</strong> ${data.strokes.length}
    `;
}

function drawFromJSON(data) {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const scaleX = canvas.width / data.canvasWidth;
    const scaleY = canvas.height / data.canvasHeight;

    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    
    // 3. Loop through every stroke
    data.strokes.forEach((stroke, index) => {
        if (stroke.length === 0) return;

        ctx.beginPath();
        
        // Color code: 1st stroke Red, 2nd Blue, others Black.
        // This helps detect if strokes are mistakenly connected.
        if (index === 0) ctx.strokeStyle = "red";
        else if (index === 1) ctx.strokeStyle = "blue";
        else ctx.strokeStyle = "black";

        // Move to the first point of the stroke (Scaled)
        const startX = stroke[0].x * scaleX;
        const startY = stroke[0].y * scaleY;
        ctx.moveTo(startX, startY);

        // Draw lines to subsequent points
        for (let i = 1; i < stroke.length; i++) {
            const x = stroke[i].x * scaleX;
            const y = stroke[i].y * scaleY;
            ctx.lineTo(x, y);
        }
        ctx.stroke();
    });
}