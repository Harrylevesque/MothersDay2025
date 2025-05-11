function startGameSushi() {
    alert(`Welcome to the Sushi Game!

Objective:
- Fulfill customer orders by selecting the correct ingredients, preparing them, and delivering the sushi.

How to Play:
1. Check the order displayed in the "Order" section of each column.
2. Click on the ingredients listed in the order to add them to the preparation area.
3. Click "Prepare" to start preparing the sushi.
4. Once preparation is complete, click "Deliver" to deliver the order.

Scoring:
- Deliver orders quickly to earn more points.
- Incorrect ingredients or delays will reduce your score.

Winning:
- Reach 200 points to win the game.

Good luck and happy sushi making!`);

    const gameArea = document.getElementById('game-area');
    gameArea.className = 'game-area-active'; // Apply a CSS class for consistent styling

    gameArea.innerHTML = `
        <h2>Sushi Game</h2>
        <div id="columns-container" style="display: flex; gap: 20px; justify-content: center;">
            <!-- Columns will be dynamically added here -->
        </div>
        <div id="score-area" style="margin-top: 20px; text-align: center;">
            <p>Score: <span id="score">0</span></p>
        </div>
    `;

    const columnsContainer = document.getElementById('columns-container');
    const scoreElement = document.getElementById('score');
    let score = 0;
    const winningScore = 200; // Winning score

    const orders = [
        { id: 1, text: "California Roll (Rice, Nori, Crab, Avocado, Cucumber)", ingredients: ["Rice", "Nori", "Crab", "Avocado", "Cucumber"], prepTime: 5000 },
        { id: 2, text: "Spicy Tuna Roll (Rice, Nori, Tuna, Spicy Mayo, Cucumber)", ingredients: ["Rice", "Nori", "Tuna", "Spicy Mayo", "Cucumber"], prepTime: 4000 },
        { id: 3, text: "Salmon Nigiri (Rice, Salmon)", ingredients: ["Rice", "Salmon"], prepTime: 3000 },
        { id: 4, text: "Eel Roll (Rice, Nori, Eel, Cucumber, Eel Sauce)", ingredients: ["Rice", "Nori", "Eel", "Cucumber", "Eel Sauce"], prepTime: 6000 },
        { id: 5, text: "Shrimp Tempura Roll (Rice, Nori, Shrimp Tempura, Avocado, Cucumber)", ingredients: ["Rice", "Nori", "Shrimp Tempura", "Avocado", "Cucumber"], prepTime: 5000 },
        { id: 6, text: "Rainbow Roll (Rice, Nori, Crab, Avocado, Tuna, Salmon)", ingredients: ["Rice", "Nori", "Crab", "Avocado", "Tuna", "Salmon"], prepTime: 7000 },
        { id: 7, text: "Vegetarian Roll (Rice, Nori, Avocado, Cucumber, Carrot)", ingredients: ["Rice", "Nori", "Avocado", "Cucumber", "Carrot"], prepTime: 4000 },
        { id: 8, text: "Dragon Roll (Rice, Nori, Eel, Avocado, Cucumber, Eel Sauce)", ingredients: ["Rice", "Nori", "Eel", "Avocado", "Cucumber", "Eel Sauce"], prepTime: 6000 },
        { id: 9, text: "Philadelphia Roll (Rice, Nori, Salmon, Cream Cheese, Cucumber)", ingredients: ["Rice", "Nori", "Salmon", "Cream Cheese", "Cucumber"], prepTime: 5000 },
        { id: 10, text: "Spider Roll (Rice, Nori, Soft Shell Crab, Avocado, Cucumber)", ingredients: ["Rice", "Nori", "Soft Shell Crab", "Avocado", "Cucumber"], prepTime: 6000 },
        { id: 11, text: "Yellowtail Roll (Rice, Nori, Yellowtail, Scallion)", ingredients: ["Rice", "Nori", "Yellowtail", "Scallion"], prepTime: 4000 },
        { id: 12, text: "Cucumber Roll (Rice, Nori, Cucumber)", ingredients: ["Rice", "Nori", "Cucumber"], prepTime: 3000 },
        { id: 13, text: "Avocado Roll (Rice, Nori, Avocado)", ingredients: ["Rice", "Nori", "Avocado"], prepTime: 3000 },
        { id: 14, text: "Tuna Nigiri (Rice, Tuna)", ingredients: ["Rice", "Tuna"], prepTime: 3000 },
        { id: 15, text: "Salmon Sashimi (Salmon)", ingredients: ["Salmon"], prepTime: 2000 },
        { id: 16, text: "Tuna Sashimi (Tuna)", ingredients: ["Tuna"], prepTime: 2000 },
        { id: 17, text: "Eel Nigiri (Rice, Eel, Eel Sauce)", ingredients: ["Rice", "Eel", "Eel Sauce"], prepTime: 4000 },
        { id: 18, text: "Shrimp Nigiri (Rice, Shrimp)", ingredients: ["Rice", "Shrimp"], prepTime: 3000 },
        { id: 19, text: "Soft Shell Crab Roll (Rice, Nori, Soft Shell Crab, Avocado)", ingredients: ["Rice", "Nori", "Soft Shell Crab", "Avocado"], prepTime: 5000 },
        { id: 20, text: "Tempura Roll (Rice, Nori, Shrimp Tempura, Avocado, Eel Sauce)", ingredients: ["Rice", "Nori", "Shrimp Tempura", "Avocado", "Eel Sauce"], prepTime: 6000 },
    ];

    const ingredients = ["Rice", "Nori", "Tuna", "Salmon", "Eel", "Avocado", "Cucumber", "Shrimp Tempura", "Eel Sauce", "Soft Shell Crab"];

    const columns = [
        { id: 1, currentOrder: null, prepIngredients: [], isPreparing: false, startTime: null },
        { id: 2, currentOrder: null, prepIngredients: [], isPreparing: false, startTime: null },
        { id: 3, currentOrder: null, prepIngredients: [], isPreparing: false, startTime: null },
    ];

    function createColumn(column) {
        const columnDiv = document.createElement('div');
        columnDiv.classList.add('column');
        columnDiv.style.border = '1px solid #ccc';
        columnDiv.style.padding = '10px';
        columnDiv.style.width = '200px';

        columnDiv.innerHTML = `
            <div id="order-area-${column.id}">
                <h3>Order</h3>
                <ul id="orders-list-${column.id}">
                    <!-- Orders will be dynamically added here -->
                </ul>
            </div>
            <div id="ingredients-area-${column.id}">
                <h3>Ingredients</h3>
                <div id="ingredients-${column.id}">
                    ${ingredients.map(ingredient => `<button class="ingredient-button" data-column="${column.id}" data-ingredient="${ingredient}">${ingredient}</button>`).join("")}
                </div>
            </div>
            <div id="prep-area-${column.id}">
                <h3>Preparation</h3>
                <div>Ingredients: <span id="prep-contents-${column.id}"></span></div>
                <button class="prep-button" data-column="${column.id}">Prepare</button>
                <div id="prep-timer-${column.id}" style="margin-top: 10px; color: green;"></div>
            </div>
            <div id="delivery-area-${column.id}">
                <h3>Delivery</h3>
                <button class="deliver-button" data-column="${column.id}">Deliver</button>
            </div>
        `;

        columnsContainer.appendChild(columnDiv);
    }

    function addOrderToColumn(column) {
        if (orders.length > 0) {
            column.currentOrder = orders[Math.floor(Math.random() * orders.length)];
            column.startTime = Date.now(); // Record the time the order was added
            const orderList = document.getElementById(`orders-list-${column.id}`);
            orderList.innerHTML = `<li>${column.currentOrder.text}</li>`;
        }
    }

    function addIngredientToPrep(columnId, ingredient) {
        const column = columns.find(col => col.id === parseInt(columnId));
        column.prepIngredients.push(ingredient);
        document.getElementById(`prep-contents-${columnId}`).textContent = column.prepIngredients.join(", ");
    }

    function prepareIngredients(columnId) {
        const column = columns.find(col => col.id === parseInt(columnId));
        if (column.isPreparing) {
            alert(`Column ${columnId} is already preparing!`);
            return;
        }
        if (column.prepIngredients.length === 0) {
            alert(`Add ingredients to the preparation area in Column ${columnId} before preparing!`);
            return;
        }
        column.isPreparing = true;

        const timerElement = document.getElementById(`prep-timer-${columnId}`);
        let timeLeft = column.currentOrder.prepTime / 1000;
        timerElement.textContent = `Preparing... ${timeLeft}s`;

        const interval = setInterval(() => {
            timeLeft--;
            if (timeLeft > 0) {
                timerElement.textContent = `Preparing... ${timeLeft}s`;
            } else {
                clearInterval(interval);
                timerElement.textContent = "Preparation complete!";
                column.isPreparing = false;
            }
        }, 1000);
    }

    function deliverOrder(columnId) {
        const column = columns.find(col => col.id === parseInt(columnId));
        if (column.isPreparing) {
            alert(`Wait for preparation to complete in Column ${columnId}!`);
            return;
        }
        const prepIngredients = column.prepIngredients.sort().join(",");
        if (column.currentOrder && prepIngredients === column.currentOrder.ingredients.sort().join(",")) {
            const deliveryTime = (Date.now() - column.startTime) / 1000; // Calculate time in seconds
            let points = 10; // Base points
            if (deliveryTime <= 3) {
                points += 20; // High bonus for very fast delivery
            } else if (deliveryTime <= 6) {
                points += 10; // Moderate bonus for fast delivery
            } else if (deliveryTime <= 10) {
                points += 5; // Small bonus for acceptable delivery time
            } else {
                points -= Math.min(10, Math.floor((deliveryTime - 10) / 2)); // Higher penalty for delays
            }
            points = Math.max(0, points); // Ensure points don't go negative
            score += points; // Add points to the score
            alert(`Order delivered successfully from Column ${columnId}!\nYou earned ${points} points.\nTime taken: ${deliveryTime.toFixed(2)} seconds.`);
            column.prepIngredients = [];
            document.getElementById(`prep-contents-${columnId}`).textContent = "";
            document.getElementById(`prep-timer-${columnId}`).textContent = ""; // Clear "Preparation complete!" text
            column.currentOrder = null;
            column.startTime = null;
            document.getElementById(`orders-list-${columnId}`).innerHTML = "";
            scoreElement.textContent = score;

            if (score >= winningScore) {
                alert("Congratulations! You've reached 200 points and won the game!");
                resetGame();
                return;
            }

            addOrderToColumn(column);
        } else {
            alert(`Incorrect ingredients in Column ${columnId}! Try again.`);
        }
    }

    function resetGame() {
        score = 0;
        scoreElement.textContent = score;
        columns.forEach(column => {
            column.currentOrder = null;
            column.prepIngredients = [];
            column.isPreparing = false;
            column.startTime = null;
            document.getElementById(`orders-list-${column.id}`).innerHTML = "";
            document.getElementById(`prep-contents-${column.id}`).textContent = "";
            document.getElementById(`prep-timer-${column.id}`).textContent = "";
        });
        columns.forEach(column => addOrderToColumn(column));
    }

    // Initialize columns
    columns.forEach(column => {
        createColumn(column);
        addOrderToColumn(column);
    });

    // Add event listeners for ingredient buttons
    document.querySelectorAll(".ingredient-button").forEach(button => {
        button.addEventListener("click", () => {
            const columnId = button.dataset.column;
            addIngredientToPrep(columnId, button.dataset.ingredient);
        });
    });

    // Add event listeners for prepare buttons
    document.querySelectorAll(".prep-button").forEach(button => {
        button.addEventListener("click", () => {
            prepareIngredients(button.dataset.column);
        });
    });

    // Add event listeners for deliver buttons
    document.querySelectorAll(".deliver-button").forEach(button => {
        button.addEventListener("click", () => {
            deliverOrder(button.dataset.column);
        });
    });

    // Add a constant stream of orders
    setInterval(() => {
        columns.forEach(column => {
            if (!column.currentOrder) {
                addOrderToColumn(column);
            }
        });
    }, 5000); // Add a new order every 5 seconds
}
