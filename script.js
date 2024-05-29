const items = [
    { name: "UGG Men's Tasman Slipper ", image: "ugg.jpg", price: 109 },
    { name: "LEVOIT Air Purifier for Home Bedroom, Smart WiFi Alexa Control, Covers up to 916 Sq.Foot, 3 in 1 Filter for Allergies, Pollutants, Smoke, Dust, 24dB Quiet for Bedroom, Core200S/Core 200S-P, White ", image: "levoit.jpg", price: 76 },
    { name: "Belemay for iPhone iPhone 12 & iPhone 12 Pro Leather Case Magsafe - Top Grain Vintage Crazy Horse Leather - Metal Buttons & Camera Bezel Bump - Slim Fit - Premium Phone Cover (6.1-inch) Tan Brown ", image: "case.jpg", price: 40 }
];

let currentItem = {};
let attempts = 0;
const maxAttempts = 3;

function loadNewItem() {
    currentItem = items[Math.floor(Math.random() * items.length)];
    document.getElementById('item-image').src = currentItem.image;
    document.getElementById('item-name').textContent = currentItem.name;
    document.getElementById('guess-input').value = '';
    document.getElementById('result').textContent = '';
    document.getElementById('result').classList.remove('correct', 'incorrect');
    document.getElementById('next-item').style.display = 'none';
    document.getElementById('submit-guess').style.display = 'inline';
    attempts = 0;
}

document.getElementById('submit-guess').addEventListener('click', () => {
    const userGuess = parseFloat(document.getElementById('guess-input').value);
    if (!isNaN(userGuess)) {
        attempts++;
        if (attempts <= maxAttempts) {
            if (userGuess >= currentItem.price * 0.9 && userGuess <= currentItem.price * 1.1) {
                document.getElementById('result').textContent = `Correct! This item sells for ${currentItem.price}$`;
                document.getElementById('result').classList.add('correct');
                document.getElementById('submit-guess').style.display = 'none';
                document.getElementById('next-item').style.display = 'inline';
            } else {
                const hint = userGuess > currentItem.price ? 'Your guess is too high.' : 'Your guess is too low.';
                document.getElementById('result').textContent = hint;
                document.getElementById('result').classList.add('incorrect');
                if (attempts === maxAttempts) {
                    document.getElementById('result').textContent = ` You've used all your attempts. The price was $${currentItem.price}.`;
                    document.getElementById('submit-guess').style.display = 'none';
                    document.getElementById('next-item').style.display = 'inline';
                }
            }
        } else {
            document.getElementById('result').textContent = `You've used all your attempts. The price was $${currentItem.price}.`;
            document.getElementById('result').classList.add('incorrect');
            document.getElementById('submit-guess').style.display = 'none';
            document.getElementById('next-item').style.display = 'inline';
        }

        // Reset classes for flashing effect
        setTimeout(() => {
            document.getElementById('result').classList.remove('correct', 'incorrect');
        }, 1000); // Reset after 1 second
    } else {
        document.getElementById('result').textContent = 'Please enter a valid number.';
    }
});


document.getElementById('next-item').addEventListener('click', loadNewItem);

window.onload = loadNewItem;
