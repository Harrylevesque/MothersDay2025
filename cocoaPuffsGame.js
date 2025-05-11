function startGame6() {
    alert(`Welcome to the Cocoa Puffs Game!

Objective:
- Complete as many bowls as possible by adding milk and cocoa puffs.

How to Play:
1. Left-click on a bowl to add cocoa puffs.
2. Right-click on a bowl to add milk.
3. Complete the bowl by adding both milk and cocoa puffs.

Winning:
- Complete at least 40 bowls before time runs out to win.

Losing:
- If the timer reaches 0 and you haven't completed enough bowls, the game is over.

Good luck and enjoy the game!`);

    const gameArea = document.getElementById('game-area');
    gameArea.style.display = 'block'; // Ensure the game area is visible
    gameArea.style.border = '2px solid #ff66b3'; // Add a pink border
    gameArea.style.borderRadius = '10px'; // Add rounded corners
    gameArea.style.padding = '20px'; // Add padding
    gameArea.style.backgroundColor = '#fff'; // Set a white background

    gameArea.innerHTML = `
        <h2>Cocoa Puffs Game</h2>
        <canvas id="cocoaCanvas" width="800" height="400"></canvas>
    `;

    const canvas = document.getElementById('cocoaCanvas');
    const ctx = canvas.getContext('2d');

    const bowls = [];
    const bowlSize = 50;
    const dropSpeed = 2; // Speed at which bowls drop
    let completedBowls = 0; // Track correctly completed bowls
    let totalBowls = 0; // Track total bowls dropped
    let timer = 100; // Game duration in seconds
    const requiredBowls = 40; // Number of good bowls required to win

    function createBowl() {
        const hasMilk = Math.random() < 0.5;
        const hasCocoaPuffs = !hasMilk && Math.random() < 0.5; // Ensure both are not true
        return {
            x: Math.random() * (canvas.width - bowlSize),
            y: -bowlSize, // Start above the canvas
            hasMilk,
            hasCocoaPuffs,
            completed: false, // Track if the bowl is correctly completed
        };
    }

    function dropNewBowl() {
        if (timer <= 0) return;
        bowls.push(createBowl());
        totalBowls++;
    }

    function drawBowls() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        bowls.forEach((bowl) => {
            ctx.beginPath();
            ctx.arc(bowl.x + bowlSize / 2, bowl.y + bowlSize / 2, bowlSize / 2, 0, Math.PI * 2);
            ctx.fillStyle = 'lightgray';
            ctx.fill();
            ctx.stroke();

            if (bowl.hasMilk) {
                ctx.beginPath();
                ctx.arc(bowl.x + bowlSize / 2, bowl.y + bowlSize / 2, bowlSize / 3, 0, Math.PI * 2);
                ctx.fillStyle = 'white';
                ctx.fill();
            }

            if (bowl.hasCocoaPuffs) {
                ctx.beginPath();
                ctx.arc(bowl.x + bowlSize / 2, bowl.y + bowlSize / 2, bowlSize / 4, 0, Math.PI * 2);
                ctx.fillStyle = 'brown';
                ctx.fill();
            }
        });

        ctx.font = '20px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText(`Time: ${timer}s`, canvas.width - 150, 30);
        ctx.fillText(`Good Bowls: ${completedBowls}/${requiredBowls}`, canvas.width - 300, 60);
    }

    function updateBowls() {
        bowls.forEach((bowl, index) => {
            bowl.y += dropSpeed;

            if (bowl.y > canvas.height) {
                bowls.splice(index, 1);
            }
        });
    }

    function getClickedBowl(x, y) {
        return bowls.find(
            (bowl) =>
                x > bowl.x &&
                x < bowl.x + bowlSize &&
                y > bowl.y &&
                y < bowl.y + bowlSize
        );
    }

    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const clickedBowl = getClickedBowl(x, y);
        if (clickedBowl) {
            if (!clickedBowl.hasCocoaPuffs) {
                clickedBowl.hasCocoaPuffs = true;
                checkCompletion(clickedBowl);
            }
        }
    });

    canvas.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const clickedBowl = getClickedBowl(x, y);
        if (clickedBowl) {
            if (!clickedBowl.hasMilk) {
                clickedBowl.hasMilk = true;
                checkCompletion(clickedBowl);
            }
        }
    });

    function checkCompletion(bowl) {
        if (bowl.hasMilk && bowl.hasCocoaPuffs) {
            bowl.completed = true;
            completedBowls++;
        }
    }

    function gameLoop() {
        if (timer <= 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = '30px Arial';
            ctx.fillStyle = 'red';
            if (completedBowls >= requiredBowls) {
                ctx.fillText('You Win!', canvas.width / 2 - 80, canvas.height / 2);
            } else {
                ctx.fillText('Game Over!', canvas.width / 2 - 80, canvas.height / 2);
            }
            return;
        }

        updateBowls();
        drawBowls();
        requestAnimationFrame(gameLoop);
    }

    function countdown() {
        if (timer > 0) {
            timer--;
            setTimeout(countdown, 1000);
        }
    }

    setInterval(dropNewBowl, 1000);
    countdown();
    gameLoop();
}

