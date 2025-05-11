function startGame4() {
    alert(`Welcome to the Cat Pictures Game!

Objective:
- Find the hidden WEASEL among the cat pictures.

How to Play:
1. Click on a picture to guess if it's the WEASEL.
2. If you click the wrong picture, the images will shuffle.
3. Keep guessing until you find the WEASEL.

Winning:
- Click on the WEASEL to win the game.

Good luck and have fun finding the WEASEL!`);

    const gameArea = document.getElementById('game-area');
    gameArea.style.display = 'block'; // Ensure the game area is visible
    gameArea.style.border = '2px solid #ff66b3'; // Add a pink border
    gameArea.style.borderRadius = '10px'; // Add rounded corners
    gameArea.style.padding = '20px'; // Add padding
    gameArea.style.backgroundColor = '#fff'; // Set a white background

    gameArea.innerHTML = `
        <h2>Cat Pictures Game</h2>
        <div id="loadingBar" style="width: 100%; height: 20px; background-color: lightgray; margin-bottom: 10px; position: relative;">
            <div id="progress" style="width: 0%; height: 100%; background-color: #ff66b3;"></div>
        </div>
        <div id="catGallery" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px; max-height: 400px; overflow-y: auto;"></div>
    `;

    const gallery = document.getElementById('catGallery');
    const progressBar = document.getElementById('progress');
    const loadingBar = document.getElementById('loadingBar');

    const totalImages = 200;
    let loadedImages = 0;

    function updateProgressBar() {
        const progress = (loadedImages / totalImages) * 100;
        progressBar.style.width = `${progress}%`;

        // Hide the progress bar when all images are loaded
        if (loadedImages === totalImages) {
            loadingBar.style.display = 'none';
        }
    }

    function loadImage(src, alt, isWeasel = false) {
        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        img.style = 'width: 100px; height: 100px; margin: 5px; object-fit: cover; display: none;';

        img.onload = () => {
            loadedImages++;
            updateProgressBar();
            img.style.display = 'block';
        };

        img.onerror = () => {
            console.error(`Failed to load image: ${src}`);
            loadedImages++;
            updateProgressBar();
        };

        if (isWeasel) {
            img.addEventListener('click', () => {
                alert('You win! You found WEASEL!');
            });
        } else {
            img.addEventListener('click', () => {
                alert('Wrong cat! Shuffling images...');
                shuffleImages();
            });
        }

        gallery.appendChild(img);
    }

    // Prepare image paths
    const imagePaths = [];
    for (let i = 1; i <= 199; i++) {
        imagePaths.push({ src: `./cat/cat.${i}.jpg`, alt: `Cat ${i}` }); // Use only the first 199 images
    }

    // Add WEASEL.jpg to the list
    imagePaths.push({ src: './cat/WEASEL.jpg', alt: 'Weasel', isWeasel: true });

    // Shuffle the image paths
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function shuffleImages() {
        gallery.innerHTML = ''; // Clear the gallery
        shuffleArray(imagePaths); // Shuffle the image paths
        imagePaths.forEach(({ src, alt, isWeasel }) => {
            loadImage(src, alt, isWeasel);
        });
    }

    // Initial shuffle and load
    shuffleArray(imagePaths);
    imagePaths.forEach(({ src, alt, isWeasel }) => {
        loadImage(src, alt, isWeasel);
    });
}
