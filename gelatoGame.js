function startGame3() {
    const gameArea = document.getElementById('game-area');
    gameArea.style.display = 'block'; // Ensure the game area is visible
    gameArea.style.border = '2px solid #ff66b3'; // Add a pink border
    gameArea.style.borderRadius = '10px'; // Add rounded corners
    gameArea.style.padding = '20px'; // Add padding
    gameArea.style.backgroundColor = '#fff'; // Set a white background

    gameArea.innerHTML = `

        <h2>Gelato Monsters Game</h2>
        <canvas id="gelatoCanvas" width="800" height="400" style="background-color: lightblue;"></canvas>
    `;

    const canvas = document.getElementById('gelatoCanvas');
    const ctx = canvas.getContext('2d');

    const player = {
        x: 100,
        y: 100,
        size: 20,
        speed: 4,
        health: 100,
        maxHealth: 100,
    };

    const monsters = [];
    const souls = [];
    const monsterSize = 20;
    const soulSize = 10;

    const tileSize = 50;
    let maze = [];
    let mazeWidth, mazeHeight;

    const camera = {
        x: 0,
        y: 0,
        width: canvas.width,
        height: canvas.height,
    };

    let score = 0;
    let totalMonsters = 0;

    const playerImage = new Image();
    playerImage.src = './player.png';

    const monsterImage = new Image();
    monsterImage.src = './evil.png';

    let imagesToLoad = 2;
    let imagesLoaded = false;
    let gameLoopRequestId = null;

    function onImageLoad() {
        imagesToLoad--;
        if (imagesToLoad === 0) {
            imagesLoaded = true;
            if (!gameLoopRequestId) {
                initializeGame();
            }
        }
    }

    playerImage.onload = onImageLoad;
    monsterImage.onload = onImageLoad;

    playerImage.onerror = () => console.error("Failed to load player.png");
    monsterImage.onerror = () => console.error("Failed to load evil.png");

    function generateMaze(rows, cols) {
        mazeWidth = cols * 2 + 1;
        mazeHeight = rows * 2 + 1;

        maze = Array.from({ length: mazeHeight }, () =>
            Array.from({ length: mazeWidth }, () => 0)
        );

        const cells = [];
        const edges = [];
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const cellIndex = row * cols + col;
                cells.push(cellIndex);

                if (col < cols - 1) {
                    edges.push({ from: cellIndex, to: cellIndex + 1, direction: 'right' });
                }
                if (row < rows - 1) {
                    edges.push({ from: cellIndex, to: cellIndex + cols, direction: 'down' });
                }
            }
        }

        for (let i = edges.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [edges[i], edges[j]] = [edges[j], edges[i]];
        }

        const sets = Array.from({ length: cells.length }, (_, i) => i);
        function findSet(cell) {
            if (sets[cell] !== cell) {
                sets[cell] = findSet(sets[cell]);
            }
            return sets[cell];
        }
        function unionSets(a, b) {
            sets[findSet(a)] = findSet(b);
        }

        edges.forEach((edge) => {
            const fromSet = findSet(edge.from);
            const toSet = findSet(edge.to);

            if (fromSet !== toSet) {
                unionSets(edge.from, edge.to);

                const fromRow = Math.floor(edge.from / cols) * 2 + 1;
                const fromCol = (edge.from % cols) * 2 + 1;
                const toRow = Math.floor(edge.to / cols) * 2 + 1;
                const toCol = (edge.to % cols) * 2 + 1;

                maze[fromRow][fromCol] = 1;
                maze[toRow][toCol] = 1;

                if (edge.direction === 'right') {
                    maze[fromRow][fromCol + 1] = 1;
                } else if (edge.direction === 'down') {
                    maze[fromRow + 1][fromCol] = 1;
                }
            }
        });

        maze[1][0] = 1;
        maze[mazeHeight - 2][mazeWidth - 1] = 1;
    }

    function drawMaze() {
        for (let row = 0; row < maze.length; row++) {
            for (let col = 0; col < maze[row].length; col++) {
                const x = col * tileSize - camera.x;
                const y = row * tileSize - camera.y;
                if (maze[row][col] === 0) {
                    ctx.fillStyle = 'black';
                    ctx.fillRect(x, y, tileSize, tileSize);
                }
            }
        }
    }

    function spawnPlayer() {
        let x, y;
        do {
            x = Math.floor(Math.random() * maze[0].length) * tileSize + tileSize / 4;
            y = Math.floor(Math.random() * maze.length) * tileSize + tileSize / 4;
        } while (maze[Math.floor(y / tileSize)][Math.floor(x / tileSize)] === 0);
        player.x = x;
        player.y = y;
    }

    function spawnMonster() {
        let x, y;
        do {
            x = Math.floor(Math.random() * maze[0].length) * tileSize + tileSize / 4;
            y = Math.floor(Math.random() * maze.length) * tileSize + tileSize / 4;
        } while (maze[Math.floor(y / tileSize)][Math.floor(x / tileSize)] === 0);
        monsters.push({
            x,
            y,
            size: monsterSize,
            health: 30,
            maxHealth: 30,
            alive: true,
        });
        totalMonsters++;
    }

    function drawPlayer() {
        const x = player.x - camera.x;
        const y = player.y - camera.y;
        if (playerImage.complete && playerImage.naturalHeight !== 0) {
            ctx.drawImage(playerImage, x, y, player.size, player.size);
        } else {
            ctx.fillStyle = 'green';
            ctx.fillRect(x, y, player.size, player.size);
        }

        ctx.fillStyle = 'red';
        ctx.fillRect(x, y - 10, (player.health / player.maxHealth) * player.size, 5);
    }

    function drawMonsters() {
        monsters.forEach((monster) => {
            if (monster.alive) {
                const x = monster.x - camera.x;
                const y = monster.y - camera.y;
                if (monsterImage.complete && monsterImage.naturalHeight !== 0) {
                    ctx.drawImage(monsterImage, x, y, monster.size, monster.size);
                } else {
                    ctx.fillStyle = 'red';
                    ctx.fillRect(x, y, monster.size, monster.size);
                }

                ctx.fillStyle = 'red';
                ctx.fillRect(x, y - 5, (monster.health / monster.maxHealth) * monster.size, 3);
            }
        });
    }

    function drawSouls() {
        souls.forEach((soul) => {
            const x = soul.x - camera.x;
            const y = soul.y - camera.y;
            ctx.fillStyle = 'yellow';
            ctx.beginPath();
            ctx.arc(x, y, soulSize, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function movePlayer(direction) {
        const nextX = player.x + (direction === 'ArrowRight' ? player.speed : direction === 'ArrowLeft' ? -player.speed : 0);
        const nextY = player.y + (direction === 'ArrowDown' ? player.speed : direction === 'ArrowUp' ? -player.speed : 0);

        const tileX = Math.floor(nextX / tileSize);
        const tileY = Math.floor(nextY / tileSize);
        const tileXEnd = Math.floor((nextX + player.size - 1) / tileSize);
        const tileYEnd = Math.floor((nextY + player.size - 1) / tileSize);

        if (
            tileY >= 0 &&
            tileY < maze.length &&
            tileX >= 0 &&
            tileX < maze[0].length &&
            tileYEnd >= 0 &&
            tileYEnd < maze.length &&
            tileXEnd >= 0 &&
            tileXEnd < maze[0].length &&
            maze[tileY][tileX] === 1 &&
            maze[tileY][tileXEnd] === 1 &&
            maze[tileYEnd][tileX] === 1 &&
            maze[tileYEnd][tileXEnd] === 1
        ) {
            player.x = nextX;
            player.y = nextY;
        }

        updateCamera();
    }

    function updateCamera() {
        camera.x = Math.max(0, Math.min(player.x - camera.width / 2, mazeWidth * tileSize - camera.width));
        camera.y = Math.max(0, Math.min(player.y - camera.height / 2, mazeHeight * tileSize - camera.height));
    }

    function attackMonsters() {
        monsters.forEach((monster) => {
            if (
                monster.alive &&
                player.x < monster.x + monster.size &&
                player.x + player.size > monster.x &&
                player.y < monster.y + monster.size &&
                player.y + player.size > monster.y
            ) {
                monster.health -= 10;
                if (monster.health <= 0) {
                    monster.alive = false;
                    souls.push({ x: monster.x + monster.size / 2, y: monster.y + monster.size / 2 });
                }
            }
        });
    }

    function monstersAttackPlayer() {
        monsters.forEach((monster) => {
            if (
                monster.alive &&
                player.x < monster.x + monster.size &&
                player.x + player.size > monster.x &&
                player.y < monster.y + monster.size &&
                player.y + player.size > monster.y
            ) {
                player.health -= 0.5;
                if (player.health <= 0) {
                    alert('Game Over!');
                    resetGame();
                }
            }
        });
    }

    function resetGame() {
        player.x = 100;
        player.y = 100;
        player.health = player.maxHealth;
        monsters.length = 0;
        souls.length = 0;
        score = 0;
        totalMonsters = 0;
        if (imagesLoaded) {
            initializeGame();
        }
    }

    function checkCollisions() {
        souls.forEach((soul, index) => {
            if (
                player.x < soul.x + soulSize &&
                player.x + player.size > soul.x - soulSize &&
                player.y < soul.y + soulSize &&
                player.y + player.size > soul.y - soulSize
            ) {
                souls.splice(index, 1);
                score++;
            }
        });
    }

    function checkWinCondition() {
        if (totalMonsters > 0 && score === totalMonsters) {
            alert('You Win! All monsters defeated!');
            resetGame();
        }
    }

    function drawScore() {
        ctx.font = '20px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText(`Score: ${score}`, 10, 20);
    }

    function gameLoop() {
        if (!imagesLoaded) {
            requestAnimationFrame(gameLoop);
            return;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawMaze();
        drawPlayer();
        drawMonsters();
        drawSouls();
        drawScore();
        checkCollisions();
        monstersAttackPlayer();
        checkWinCondition();
        gameLoopRequestId = requestAnimationFrame(gameLoop);
    }

    function initializeGame() {
        generateMaze(10, 10);
        spawnPlayer();
        totalMonsters = 0;
        monsters.length = 0;
        souls.length = 0;
        score = 0;
        for (let i = 0; i < 5; i++) spawnMonster();
        updateCamera();
        if (imagesLoaded && !gameLoopRequestId) {
            gameLoop();
        }
    }

    document.addEventListener('keydown', (event) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) {
            event.preventDefault();
        }

        if (event.key === ' ') {
            attackMonsters();
        } else {
            movePlayer(event.key);
        }
    });

    if (imagesToLoad === 0) {
        imagesLoaded = true;
        initializeGame();
    }
}
