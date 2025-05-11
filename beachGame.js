function startGame2() {
    const gameArea = document.getElementById('game-area');
    gameArea.style.display = 'block'; // Ensure the game area is visible
    gameArea.style.border = '2px solid #ff66b3'; // Add a pink border
    gameArea.style.borderRadius = '10px'; // Add rounded corners
    gameArea.style.padding = '20px'; // Add padding
    gameArea.style.backgroundColor = '#fff'; // Set a white background

    gameArea.innerHTML = `

        <h2>Sandcastle Defense</h2>
        <canvas id="beachCanvas" width="800" height="400" style="background-color: sandybrown; cursor: crosshair;"></canvas>
        <p>Survive for 1.5 minutes! Aim with the mouse and click to shoot rocks from your catapult.</p>
        <p>Time Left: <span id="timeLeft">90</span>s | Sandcastle Health: <span id="sandcastleHealth">100</span></p>
    `;

    const canvas = document.getElementById('beachCanvas');
    const ctx = canvas.getContext('2d');

    const sandcastle = {
        x: canvas.width / 2 - 50, // Center the sandcastle
        y: canvas.height - 100,  // Position at the bottom center
        width: 100,
        height: 100,
        health: 100,
        maxHealth: 100,
        image: new Image(),
    };

    sandcastle.image.src = './castle.png';

    const catapult = {
        x: sandcastle.x + sandcastle.width / 2,
        y: sandcastle.y,
        angle: 0,
        rockSpeed: 7,
    };

    const rocks = [];
    const crabs = [];
    let timeLeft = 90; // 1.5 minutes
    let gameTimerInterval;
    let spawnCrabInterval;
    let gameRunning = true;

    const crabSize = 20;
    const rockSize = 5;
    const initialCrabSpeed = 0.2 + Math.random() * 0.5; // Slower crab speed

    // Tide system
    let tideLevel = 0; // Starts at the top
    const maxTideLevel = canvas.height * 0.5; // Tide rises to 50% of canvas height
    const tideSpeed = maxTideLevel / 4000; // Adjust tide speed to descend over 100 seconds

    // Function to draw the sandcastle
    function drawSandcastle() {
        const healthPercentage = sandcastle.health / sandcastle.maxHealth;
        const visibleHeight = sandcastle.height * healthPercentage;

        if (sandcastle.image.complete) {
            ctx.drawImage(
                sandcastle.image,
                0, sandcastle.image.height * (1 - healthPercentage), sandcastle.image.width, sandcastle.image.height * healthPercentage, // Crop the image vertically
                sandcastle.x, sandcastle.y + sandcastle.height * (1 - healthPercentage), sandcastle.width, visibleHeight // Draw the cropped image
            );
        } else {
            // Fallback if the image is not loaded
            ctx.fillStyle = 'tan';
            ctx.fillRect(sandcastle.x, sandcastle.y + sandcastle.height * (1 - healthPercentage), sandcastle.width, visibleHeight);
        }

        // Simple catapult representation
        ctx.fillStyle = 'saddlebrown';
        ctx.fillRect(catapult.x - 5, catapult.y - 20, 10, 20); // Catapult base
        // Catapult arm
        ctx.save();
        ctx.translate(catapult.x, catapult.y);
        ctx.rotate(catapult.angle);
        ctx.fillRect(-2.5, -30, 5, 30); // Arm
        ctx.restore();
    }

    // Function to draw crabs
    function drawCrabs() {
        crabs.forEach((crab) => {
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(crab.x, crab.y, crabSize / 2, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    // Function to draw rocks
    function drawRocks() {
        rocks.forEach((rock) => {
            ctx.fillStyle = 'gray';
            ctx.beginPath();
            ctx.arc(rock.x, rock.y, rockSize, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    // Function to draw the tide
    function drawTide() {
        ctx.fillStyle = 'blue'; // Solid blue for water
        ctx.fillRect(0, 0, canvas.width, tideLevel); // Draw tide from the top
    }

    // Function to spawn crabs
    function spawnCrab() {
        if (!gameRunning) return;

        for (let i = 0; i < 4; i++) { // Spawn 4 crabs at a time
            const spawnY = tideLevel; // Always spawn crabs on the tide line
            const x = Math.random() * canvas.width; // Random horizontal position

            crabs.push({ x, y: spawnY, speed: initialCrabSpeed });
        }
    }

    // Update catapult angle based on mouse position
    canvas.addEventListener('mousemove', (event) => {
        if (!gameRunning) return;
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        catapult.angle = Math.atan2(mouseY - catapult.y, mouseX - catapult.x) + Math.PI / 2;
    });

    // Shoot rocks on click
    canvas.addEventListener('click', (event) => {
        if (!gameRunning) return;
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const angle = Math.atan2(mouseY - catapult.y, mouseX - catapult.x);
        rocks.push({
            x: catapult.x,
            y: catapult.y,
            dx: Math.cos(angle) * catapult.rockSpeed,
            dy: Math.sin(angle) * catapult.rockSpeed,
        });
    });

    // Function to update game objects
    function updateGameObjects() {
        if (!gameRunning) return;

        // Update tide level
        if (tideLevel < maxTideLevel) {
            tideLevel += tideSpeed;
        } else {
            tideLevel = maxTideLevel;
        }

        // Move rocks and check for collisions
        rocks.forEach((rock, rockIndex) => {
            rock.x += rock.dx;
            rock.y += rock.dy;

            // Remove rocks that go off-screen
            if (rock.x < 0 || rock.x > canvas.width || rock.y < 0 || rock.y > canvas.height) {
                rocks.splice(rockIndex, 1);
            } else {
                // Check for rock-crab collisions
                crabs.forEach((crab, crabIndex) => {
                    const dist = Math.hypot(rock.x - crab.x, rock.y - crab.y);
                    if (dist < rockSize + crabSize / 2) {
                        crabs.splice(crabIndex, 1); // Crab is killed
                        rocks.splice(rockIndex, 1); // Rock is consumed
                        // Potentially add score here
                    }
                });
            }
        });

        // Move crabs toward the sandcastle
        crabs.forEach((crab, index) => {
            const dx = sandcastle.x + sandcastle.width / 2 - crab.x;
            const dy = sandcastle.y + sandcastle.height / 2 - crab.y;
            const distance = Math.hypot(dx, dy);

            if (distance < crabSize / 2 + sandcastle.width / 2) {
                sandcastle.health -= 10; // Crabs deal 10 damage
                crabs.splice(index, 1);
                document.getElementById('sandcastleHealth').textContent = sandcastle.health;
                if (sandcastle.health <= 0) {
                    endGame(false); // Player loses
                }
            } else {
                crab.x += (dx / distance) * crab.speed;
                crab.y += (dy / distance) * crab.speed;
            }
        });
    }

    function updateTimer() {
        if (!gameRunning) return;
        timeLeft--;
        document.getElementById('timeLeft').textContent = timeLeft;
        if (timeLeft <= 0) {
            endGame(true); // Player wins
        }
    }

    function endGame(playerWon) {
        gameRunning = false;
        clearInterval(gameTimerInterval);
        clearInterval(spawnCrabInterval);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '40px Arial';
        ctx.textAlign = 'center';
        if (playerWon) {
            ctx.fillText('You Survived!', canvas.width / 2, canvas.height / 2);
        } else {
            ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2);
            document.getElementById('sandcastleHealth').textContent = 0; // Ensure health shows 0
        }
        ctx.font = '20px Arial';
        ctx.fillText('Click to play again.', canvas.width / 2, canvas.height / 2 + 40);
        canvas.onclick = () => { // Simplified reset
            resetGame();
            startGame2(); // Restart the game setup
        };
    }

    // Function to reset the game
    function resetGame() {
        sandcastle.health = sandcastle.maxHealth;
        rocks.length = 0;
        crabs.length = 0;
        timeLeft = 90;
        tideLevel = 0; // Reset tide level
        gameRunning = true;
        document.getElementById('timeLeft').textContent = timeLeft;
        document.getElementById('sandcastleHealth').textContent = sandcastle.health;
    }

    function gameLoop() {
        if (!gameRunning) return;

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw game elements
        drawTide();
        drawSandcastle();
        drawCrabs();
        drawRocks();

        // Update game objects
        updateGameObjects();

        // Request the next frame
        requestAnimationFrame(gameLoop);
    }

    // Start the game loop and timers
    gameTimerInterval = setInterval(updateTimer, 1000);
    spawnCrabInterval = setInterval(spawnCrab, 2000);
    gameLoop();
}