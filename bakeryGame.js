function startGame1() {
    const gameArea = document.getElementById('game-area');
    gameArea.className = 'game-area-active'; // Apply a CSS class for consistent styling

    gameArea.innerHTML = `
        <h2>Bakery Game</h2>
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
    const winningScore = 45; // Updated winning score

    const orders = [
        { id: 1, text: "Cake (Flour, Sugar, Eggs)", ingredients: ["Flour", "Sugar", "Eggs"], cookTime: 5000 },
        { id: 2, text: "Cookies (Flour, Butter, Sugar)", ingredients: ["Flour", "Butter", "Sugar"], cookTime: 3000 },
        { id: 3, text: "Pie (Flour, Eggs, Butter)", ingredients: ["Flour", "Eggs", "Butter"], cookTime: 7000 },
        { id: 4, text: "Brownies (Flour, Cocoa, Sugar, Butter)", ingredients: ["Flour", "Cocoa", "Sugar", "Butter"], cookTime: 6000 },
        { id: 5, text: "Muffins (Flour, Sugar, Eggs, Milk)", ingredients: ["Flour", "Sugar", "Eggs", "Milk"], cookTime: 4000 },
        { id: 6, text: "Croissant (Flour, Butter, Milk)", ingredients: ["Flour", "Butter", "Milk"], cookTime: 8000 },
        { id: 7, text: "Donuts (Flour, Sugar, Eggs, Oil)", ingredients: ["Flour", "Sugar", "Eggs", "Oil"], cookTime: 5000 },
        { id: 8, text: "Pancakes (Flour, Milk, Eggs, Sugar)", ingredients: ["Flour", "Milk", "Eggs", "Sugar"], cookTime: 3000 },
        { id: 9, text: "Waffles (Flour, Milk, Eggs, Butter)", ingredients: ["Flour", "Milk", "Eggs", "Butter"], cookTime: 4000 },
        { id: 10, text: "Tart (Flour, Butter, Sugar, Eggs)", ingredients: ["Flour", "Butter", "Sugar", "Eggs"], cookTime: 7000 },
        { id: 11, text: "Eclairs (Flour, Butter, Eggs, Cream)", ingredients: ["Flour", "Butter", "Eggs", "Cream"], cookTime: 6000 },
        { id: 12, text: "Macarons (Almond, Sugar, Eggs)", ingredients: ["Almond", "Sugar", "Eggs"], cookTime: 5000 },
        { id: 13, text: "Cheesecake (Cheese, Sugar, Eggs, Butter)", ingredients: ["Cheese", "Sugar", "Eggs", "Butter"], cookTime: 8000 },
        { id: 14, text: "Cupcakes (Flour, Sugar, Eggs, Butter)", ingredients: ["Flour", "Sugar", "Eggs", "Butter"], cookTime: 4000 },
        { id: 15, text: "Bagels (Flour, Sugar, Yeast, Water)", ingredients: ["Flour", "Sugar", "Yeast", "Water"], cookTime: 6000 },
        { id: 16, text: "Pretzels (Flour, Butter, Yeast, Salt)", ingredients: ["Flour", "Butter", "Yeast", "Salt"], cookTime: 7000 },
        { id: 17, text: "Baguette (Flour, Water, Yeast, Salt)", ingredients: ["Flour", "Water", "Yeast", "Salt"], cookTime: 9000 },
        { id: 18, text: "Scones (Flour, Butter, Sugar, Milk)", ingredients: ["Flour", "Butter", "Sugar", "Milk"], cookTime: 5000 },
        { id: 19, text: "Churros (Flour, Sugar, Butter, Oil)", ingredients: ["Flour", "Sugar", "Butter", "Oil"], cookTime: 4000 },
    ];

    const ingredients = ["Flour", "Sugar", "Eggs", "Butter", "Milk", "Oil", "Cocoa", "Cream", "Cheese", "Almond", "Yeast", "Water", "Salt"];

    const columns = [
        { id: 1, currentOrder: null, ovenIngredients: [], isCooking: false, startTime: null },
        { id: 2, currentOrder: null, ovenIngredients: [], isCooking: false, startTime: null },
        { id: 3, currentOrder: null, ovenIngredients: [], isCooking: false, startTime: null },
    ];

    function createColumn(column) {
        const columnDiv = document.createElement('div');
        columnDiv.classList.add('column');
        columnDiv.style.border = '1px solid #ccc';
        columnDiv.style.padding = '10px';
        columnDiv.style.width = '200px';

        columnDiv.innerHTML = `
            <style>
                game-area {
                    color: rgb(243, 243, 243);
                    background-color: rgb(68, 68, 68);
                    border: 1px solid rgb(255, 255, 255);
                    border-radius: 20px;
                }
            </style>
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
            <div id="oven-area-${column.id}">
                <h3>Oven</h3>
                <div>Ingredients: <span id="oven-contents-${column.id}"></span></div>
                <button class="cook-button" data-column="${column.id}">Cook</button>
                <div id="cooking-timer-${column.id}" style="margin-top: 10px; color: green;"></div>
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

    function addIngredientToOven(columnId, ingredient) {
        const column = columns.find(col => col.id === parseInt(columnId));
        column.ovenIngredients.push(ingredient);
        document.getElementById(`oven-contents-${columnId}`).textContent = column.ovenIngredients.join(", ");
    }

    function cookIngredients(columnId) {
        const column = columns.find(col => col.id === parseInt(columnId));
        if (column.isCooking) {
            alert(`Column ${columnId} is already cooking!`);
            return;
        }
        if (column.ovenIngredients.length === 0) {
            alert(`Add ingredients to the oven in Column ${columnId} before cooking!`);
            return;
        }
        column.isCooking = true;

        const timerElement = document.getElementById(`cooking-timer-${columnId}`);
        let timeLeft = column.currentOrder.cookTime / 1000;
        timerElement.textContent = `Cooking... ${timeLeft}s`;

        const interval = setInterval(() => {
            timeLeft--;
            if (timeLeft > 0) {
                timerElement.textContent = `Cooking... ${timeLeft}s`;
            } else {
                clearInterval(interval);
                timerElement.textContent = "Cooking complete!";
                column.isCooking = false;
            }
        }, 1000);
    }

    function deliverOrder(columnId) {
        const column = columns.find(col => col.id === parseInt(columnId));
        if (column.isCooking) {
            alert(`Wait for cooking to complete in Column ${columnId}!`);
            return;
        }
        const ovenIngredients = column.ovenIngredients.sort().join(",");
        if (column.currentOrder && ovenIngredients === column.currentOrder.ingredients.sort().join(",")) {
            const deliveryTime = (Date.now() - column.startTime) / 1000; // Calculate time in seconds
            let points = 10; // Base points
            if (deliveryTime <= 10) {
                points += 20; // High bonus for very fast delivery
            } else if (deliveryTime <= 20) {
                points += 10; // Moderate bonus for fast delivery
            } else if (deliveryTime <= 30) {
                points += 5; // Small bonus for acceptable delivery time
            } else {
                points -= Math.min(10, Math.floor((deliveryTime - 10) / 2)); // Higher penalty for delays
            }
            points = Math.max(0, points); // Ensure points don't go negative
            score += points; // Add points to the score
            alert(`Order delivered successfully from Column ${columnId}!\nYou earned ${points} points.\nTime taken: ${deliveryTime.toFixed(2)} seconds.`);
            column.ovenIngredients = [];
            document.getElementById(`oven-contents-${columnId}`).textContent = "";
            document.getElementById(`cooking-timer-${columnId}`).textContent = ""; // Clear "Cooking complete!" text
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
            column.ovenIngredients = [];
            column.isCooking = false;
            column.startTime = null;
            document.getElementById(`orders-list-${column.id}`).innerHTML = "";
            document.getElementById(`oven-contents-${column.id}`).textContent = "";
            document.getElementById(`cooking-timer-${column.id}`).textContent = "";
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
            addIngredientToOven(columnId, button.dataset.ingredient);
        });
    });

    // Add event listeners for cook buttons
    document.querySelectorAll(".cook-button").forEach(button => {
        button.addEventListener("click", () => {
            cookIngredients(button.dataset.column);
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
