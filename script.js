// Load JSON data
async function loadJSON() {
    const response = await fetch('data_file.json');
    const data = await response.json();
    console.log('Loaded JSON data:', data);  // Debugging log
    return data;
}

// Function to get 5 random non-repeating items
function getRandomItems(data, count) {
    const itemNames = data['product name'];
    const itemPrices = data['price($)'];
    const itemImages = data['image'];

    // Log the structure of the data to verify it
    console.log('Product Names:', itemNames);
    console.log('Prices:', itemPrices);
    console.log('Images:', itemImages);

    if (!itemNames || !itemPrices || !itemImages) {
        console.error('Missing data fields:', { itemNames, itemPrices, itemImages });  // Error logging
        return [];
    }

    const itemIndices = Object.keys(itemNames);
    if (!itemIndices || itemIndices.length === 0) {
        console.error('No items found in data:', data);  // Error logging
        return [];
    }

    const shuffledIndices = itemIndices.sort(() => 0.5 - Math.random());
    const selectedIndices = shuffledIndices.slice(0, count);

    const items = selectedIndices.map(index => ({
        name: itemNames[index],
        price: itemPrices[index],
        image: `images/${itemImages[index]}`
    }));

    console.log('Selected items:', items);  // Debugging log
    return items;
}

// Initialize game variables
let items = [];
let currentIndex = 0;
let score = 0;
let highScore = 0;
let attempts = 0;

// Function to start the game
async function startGame() {
    try {
        const data = await loadJSON();
        items = getRandomItems(data, 5);
        currentIndex = 0;
        score = 0;
        attempts = 0;
        highScore = localStorage.getItem('highScore') || 0;
        document.getElementById('score').textContent = `Score: ${score}`;
        document.getElementById('high-score').textContent = `High Score: ${highScore}`;
        document.getElementById('items-in-cart').textContent = `Items in Cart: 1/${items.length}`;
        document.getElementById('next-item').style.display = 'none';
        document.getElementById('restart-game').style.display = 'none';
        displayItem();
    } catch (error) {
        console.error('Error starting the game:', error);  // Error logging
    }
}

// Function to display the current item
function displayItem() {
    if (currentIndex < items.length) {
        const item = items[currentIndex];
        console.log('Displaying item:', item);  // Debugging log
        document.getElementById('item-image').src = item.image;
        document.getElementById('item-name').textContent = item.name;
        document.getElementById('guess-input').value = '';
        document.getElementById('result').textContent = '';
        document.getElementById('items-in-cart').textContent = `Items in Cart: ${currentIndex + 1}/${items.length}`;
        attempts = 0;
        document.getElementById('submit-guess').style.display = 'inline';
        document.getElementById('next-item').style.display = 'none';
        document.getElementById('restart-game').style.display = 'none';
        document.getElementById('submit-guess').disabled = false;
    } else {
        endGame();
    }
}

// Function to handle the guess submission
function submitGuess() {
    if (currentIndex >= items.length) {
        console.error('No more items to guess.');  // Error logging
        return;
    }

    const guess = parseFloat(document.getElementById('guess-input').value);
    const actualPrice = items[currentIndex].price;
    const result = document.getElementById('result');

    attempts++;
    const lowerBound = actualPrice * 0.9;
    const upperBound = actualPrice * 1.1;

    if (guess >= lowerBound && guess <= upperBound) {
        result.textContent = `Correct! The price is $${actualPrice.toFixed(2)}`;
        result.className = 'correct flash-green';
        if (attempts === 1) {
            score += 50;
        } else if (attempts === 2) {
            score += 40;
        } else if (attempts === 3) {
            score += 30;
        }
        document.getElementById('submit-guess').style.display = 'none';
        document.getElementById('next-item').style.display = 'inline';
        launchConfetti();
    } else {
        if (guess < actualPrice) {
            result.textContent = `Too low! Attempt ${attempts} of 3`;
        } else {
            result.textContent = `Too high! Attempt ${attempts} of 3`;
        }
        result.className = 'incorrect flash-red';
    }

    document.getElementById('score').textContent = `Score: ${score}`;

    if (attempts >= 3) {
        result.textContent += `. The correct price was $${actualPrice.toFixed(2)}`;
        document.getElementById('submit-guess').style.display = 'none';
        document.getElementById('next-item').style.display = 'inline';
    }

    if (attempts >= 3) {
        document.getElementById('submit-guess').disabled = true;
    }
}

// Function to handle the next item button
function nextItem() {
    document.getElementById('next-item').style.display = 'none';
    document.getElementById('restart-game').style.display = 'none';
    currentIndex++;
    displayItem();
}

// Function to end the game
function endGame() {
    document.getElementById('result').textContent = `Game Over! Your final score is ${score}.`;
    if (score > highScore) {
        localStorage.setItem('highScore', score);
        highScore = score;
        document.getElementById('high-score').textContent = `High Score: ${highScore}`;
    }
    document.getElementById('restart-game').style.display = 'inline';
}

// Event listeners
document.getElementById('submit-guess').addEventListener('click', submitGuess);
document.getElementById('next-item').addEventListener('click', nextItem);
document.getElementById('restart-game').addEventListener('click', startGame);

// Function to launch confetti
function launchConfetti() {
    var end = Date.now() + 5 * 1000;

    var colors = ['#bb0000', '#ffffff'];

    (function frame() {
        confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors
        });
        confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

// Load confetti script
const script = document.createElement('script');
script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.3.2/dist/confetti.browser.min.js";
document.head.appendChild(script);

// Start the game on load
window.onload = startGame;
