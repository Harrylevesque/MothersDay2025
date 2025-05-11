function startGame5() {
    alert(`Welcome to the Watercolor Painting Game!

Objective:
- Create beautiful watercolor art by painting on the canvas.

How to Play:
1. Select a color using the color picker.
2. Click and drag on the canvas to paint with your selected color.
3. Overlap colors to create new effects.

Enjoy the relaxing experience of painting!`);

    const gameArea = document.getElementById('game-area');
    gameArea.style.display = 'block'; // Ensure the game area is visible
    gameArea.style.border = '2px solid #ff66b3'; // Add a pink border
    gameArea.style.borderRadius = '10px'; // Add rounded corners
    gameArea.style.padding = '20px'; // Add padding
    gameArea.style.backgroundColor = '#fff'; // Set a white background

    gameArea.innerHTML = `
        <h2>Watercolor Painting Game</h2>
        <p>Click and drag on the canvas to paint with your selected color. Overlap colors to create new effects!</p>
        <div>
            <label for="colorPicker">Choose a color:</label>
            <input type="color" id="colorPicker" value="#00ffff" />
        </div>
        <div style="display: flex; justify-content: center; margin-top: 20px;">
            <canvas id="watercolorCanvas" width="600" height="400" style="background-color: white;"></canvas>
        </div>
    `;

    const canvas = document.getElementById('watercolorCanvas');
    const ctx = canvas.getContext('2d');
    let currentColor = '#00ffff'; // Default color (cyan)
    let isDrawing = false; // Track if the user is currently drawing

    // Set up the color picker
    document.getElementById('colorPicker').addEventListener('input', (event) => {
        currentColor = event.target.value;
    });

    // Function to create an irregular shape
    function drawIrregularDot(x, y, color) {
        ctx.globalCompositeOperation = 'source-over'; // Allow blending of overlapping colors
        ctx.beginPath();
        const radiusX = Math.random() * 15 + 10; // Random horizontal radius
        const radiusY = Math.random() * 15 + 10; // Random vertical radius
        const rotation = Math.random() * Math.PI * 2; // Random rotation
        ctx.ellipse(x, y, radiusX, radiusY, rotation, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.6; // Set transparency for blending
        ctx.fill();
        ctx.globalAlpha = 1.0; // Reset transparency
    }

    // Handle mouse events for free drawing
    canvas.addEventListener('mousedown', (event) => {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        drawIrregularDot(x, y, currentColor); // Draw with the selected color
    });

    canvas.addEventListener('mousemove', (event) => {
        if (isDrawing) {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            drawIrregularDot(x, y, currentColor); // Draw with the selected color
        }
    });

    canvas.addEventListener('mouseup', () => {
        isDrawing = false;
    });

    canvas.addEventListener('mouseleave', () => {
        isDrawing = false;
    });
}
