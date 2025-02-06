const NUM_OPTIONS = 6; // number of color buttons shown each round
let targetColor = '';
let score = 0;

// Generates a random hex color, e.g. "#A1B2C3"
function generateRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Shuffle array in place
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Initialize a single game round
function initGame() {
  // Generate the target color
  targetColor = generateRandomColor();
  document.querySelector('[data-testid="colorBox"]').style.backgroundColor = targetColor;

  // Generate an array of random colors (including the correct one)
  let colorOptions = [targetColor];
  while (colorOptions.length < NUM_OPTIONS) {
    const randCol = generateRandomColor();
    // Avoid duplicates
    if (!colorOptions.includes(randCol)) {
      colorOptions.push(randCol);
    }
  }

  // Shuffle color options
  shuffleArray(colorOptions);

  // Render buttons
  const optionsContainer = document.querySelector('[data-testid="colorOptions"]');
  optionsContainer.innerHTML = ''; // clear old buttons

  colorOptions.forEach(col => {
    const btn = document.createElement('button');
    btn.classList.add('color-btn');
    btn.dataset.color = col;
    btn.style.backgroundColor = col;
    btn.addEventListener('click', handleGuess);
    optionsContainer.appendChild(btn);
  });

  // Reset the game status message
  const gameStatus = document.querySelector('[data-testid="gameStatus"]');
  gameStatus.textContent = '';
  gameStatus.classList.remove('correct', 'wrong');
}

// Handle user guess
function handleGuess(e) {
  const guessedColor = e.target.dataset.color;
  const gameStatus = document.querySelector('[data-testid="gameStatus"]');

  if (guessedColor === targetColor) {
    // Correct guess
    score++;
    document.querySelector('[data-testid="score"]').textContent = score.toString();

    gameStatus.textContent = 'Correct! Well done!';
    gameStatus.classList.remove('wrong');
    gameStatus.classList.add('correct');

    // Celebrate animation on the correct button
    e.target.classList.add('celebrate');
    setTimeout(() => {
      e.target.classList.remove('celebrate');
      initGame(); // next round
    }, 500);

  } else {
    // Wrong guess
    gameStatus.textContent = 'Wrong! Try again!';
    gameStatus.classList.remove('correct');
    gameStatus.classList.add('wrong');

    // Shake animation on the clicked button
    e.target.classList.add('wrong-animation');
    setTimeout(() => {
      e.target.classList.remove('wrong-animation');
    }, 500);

    // Disable the wrong guess button
    e.target.disabled = true;
  }
}

// New Game button resets the score and restarts
document.querySelector('[data-testid="newGameButton"]').addEventListener('click', () => {
  score = 0;
  document.querySelector('[data-testid="score"]').textContent = '0';
  initGame();
});

// Start the first round
initGame();