function startWatercolorPaintingGame() {
    const gameArea = document.getElementById('game-area');
    gameArea.innerHTML = `
        <h2>Watercolor Painting Game</h2>
        <p>Click and drag on the canvas to paint with cyan, yellow, or magenta. Overlap colors to create new ones!</p>
        <div>
            <button id="cyanButton" style="background-color: cyan; color: black;">Cyan</button>
            <button id="yellowButton" style="background-color: yellow; color: black;">Yellow</button>
            <button id="magentaButton" style="background-color: magenta; color: white;">Magenta</button>
        </div>
        <div style="display: flex; justify-content: center; margin-top: 20px;">
            <canvas id="watercolorCanvas" width="600" height="400" style="background-color: white;"></canvas>
        </div>
    `;

    const canvas = document.getElementById('watercolorCanvas');
    const ctx = canvas.getContext('2d');
    let currentColor = 'cyan'; // Default color
    let isDrawing = false; // Track if the user is currently drawing

    // Set up color selection buttons
    document.getElementById('cyanButton').addEventListener('click', () => {
        currentColor = 'cyan';
    });
    document.getElementById('yellowButton').addEventListener('click', () => {
        currentColor = 'yellow';
    });
    document.getElementById('magentaButton').addEventListener('click', () => {
        currentColor = 'magenta';
    });

    // Function to create an irregular shape
    function drawIrregularDot(x, y, color, alpha) {
        ctx.globalCompositeOperation = 'lighter'; // Blend colors when overlapping
        ctx.beginPath();
        const radiusX = Math.random() * 15 + 10; // Random horizontal radius
        const radiusY = Math.random() * 15 + 10; // Random vertical radius
        const rotation = Math.random() * Math.PI * 2; // Random rotation
        ctx.ellipse(x, y, radiusX, radiusY, rotation, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${getRandomColorComponents()}, ${alpha})`;
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over'; // Reset to default
    }

    // Function to get random RGB components for a color
    function getRandomColorComponents() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `${r}, ${g}, ${b}`;
    }

    // Handle mouse events for free drawing
    canvas.addEventListener('mousedown', (event) => {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        drawIrregularDot(x, y, currentColor, 0.8); // Start with a high alpha
    });

    canvas.addEventListener('mousemove', (event) => {
        if (isDrawing) {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            drawIrregularDot(x, y, currentColor, 0.6); // Slightly lower alpha for continuous drawing
        }
    });

    canvas.addEventListener('mouseup', () => {
        isDrawing = false;
    });

    canvas.addEventListener('mouseleave', () => {
        isDrawing = false;
    });
}
