const colorBox = document.querySelector('[data-testid="colorBox"]');
const colorOptionsContainer = document.querySelector('[data-testid="colorOptions"]');
const gameStatus = document.querySelector('[data-testid="gameStatus"]');
const scoreElement = document.querySelector('[data-testid="score"]');
const newGameButton = document.querySelector('[data-testid="newGameButton"]');

let score = 0;
let targetColor;

// 1) Basic random color
function getRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * 2) Generate 'count' colors that are:
 *    - All fairly distant from the baseColor
 *    - Also spaced out from each other
 *
 *    You can adjust MIN_DISTANCE_BASE_TARGET if you need them
 *    even more (or less) distinct from the base color.
 *    You can adjust MIN_DISTANCE_EACH_OTHER if you want them
 *    to be more or less distinct from each other.
 */
function generateDistinctColors(baseColor, count) {
  const colorRegex = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/;
  const [, baseR, baseG, baseB] = baseColor.match(colorRegex).map(Number);

  // Larger → bigger gap from base color
  const MIN_DISTANCE_BASE_TARGET = 30000; 
  // Larger → bigger gap among the distractors themselves
  const MIN_DISTANCE_EACH_OTHER = 10000;  

  function distanceSquared(r1, g1, b1, r2, g2, b2) {
    return (r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2;
  }

  const result = [];

  // Keep generating colors until we have 'count' that satisfy both conditions
  while (result.length < count) {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    // Check distance from base color
    const distFromBase = distanceSquared(r, g, b, baseR, baseG, baseB);
    if (distFromBase < MIN_DISTANCE_BASE_TARGET) {
      continue; // too close to the target color
    }

    // Check distance from all already-chosen colors
    let tooCloseToOthers = false;
    for (const existingColor of result) {
      const [_, exR, exG, exB] = existingColor.match(colorRegex).map(Number);
      if (distanceSquared(r, g, b, exR, exG, exB) < MIN_DISTANCE_EACH_OTHER) {
        tooCloseToOthers = true;
        break;
      }
    }

    if (!tooCloseToOthers) {
      // Good color, push to array
      result.push(`rgb(${r}, ${g}, ${b})`);
    }
  }

  return result;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function updateScore() {
  scoreElement.textContent = score;
}

function createNewRound() {
  // Target color
  targetColor = getRandomColor();
  colorBox.style.backgroundColor = targetColor;

  // Generate 5 distinct distractors
  const distinctColors = generateDistinctColors(targetColor, 5);
  // Combine them with the target color & shuffle
  const allColors = shuffleArray([...distinctColors, targetColor]);

  colorOptionsContainer.innerHTML = '';

  allColors.forEach(color => {
    const button = document.createElement('button');
    button.className = 'color-option-btn';
    button.style.backgroundColor = color;
    button.dataset.color = color;
    button.addEventListener('click', handleGuess);
    colorOptionsContainer.appendChild(button);
  });

  gameStatus.textContent = 'Guess the correct color!';
  gameStatus.style.color = '#333';
}

function handleGuess(e) {
  const selectedColor = e.target.dataset.color;

  if (selectedColor === targetColor) {
    score++;
    updateScore();
    gameStatus.textContent = 'Correct! Well done! 🎉';
    gameStatus.style.color = '#4CAF50';
    e.target.classList.add('correct');
    setTimeout(createNewRound, 1000);
  } else {
    gameStatus.textContent = 'Wrong! Try again. 😞';
    gameStatus.style.color = '#ff4444';
    e.target.classList.add('wrong');
    const correctButton = [...colorOptionsContainer.children]
      .find(btn => btn.dataset.color === targetColor);
    correctButton.classList.add('correct');
    setTimeout(() => {
      e.target.classList.remove('wrong');
      correctButton.classList.remove('correct');
    }, 1000);
  }
}

newGameButton.addEventListener('click', () => {
  score = 0;
  updateScore();
  createNewRound();
});

// Initialize game
createNewRound();
