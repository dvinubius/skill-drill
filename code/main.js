var gameState; // 'ready', 'playing', 'over'

var correctAnswer;

var counter;
var question;
var choices;
var start_reset_button;
var scoreDisplay;
var scoreValue;
var timeDisplay;
var feedbackCorrect;
var feedbackWrong;
var gameOverDisplay;
var finalScoreDisplay;

window.onload = () => {
  initGlobals();
  resetGame();
}

/* Init references to the DOM*/
function initGlobals() {
  question = document.getElementById('question');
  choices = document.getElementById('choices');
  start_reset_button = document.getElementById('start_reset');
  scoreDisplay = document.getElementById('score');
  scoreValue = document.getElementById('scoreValue');
  timeDisplay = document.getElementById('timeDisplay');
  feedbackCorrect = document.getElementById('feedbackCorrect');
  feedbackWrong = document.getElementById('feedbackWrong');
  gameOverDisplay = document.getElementById('gameOver');
  finalScoreDisplay = document.getElementById('finalScoreDisplay');

  // AUX for resetGame()
  scoreDisplay.reset = function() {
    scoreValue = 0;
    this.style.visibility = 'visible';
  }
  // AUX for resetGame()
  timeDisplay.reset = function() {
    counter=60;
    this.style.visibility = 'visible';
  }
  // AUX for resetGame()
  choices.reset = function() {
    squares = choices.children;
    for (var i=0; i<squares.length; i++) {
      squares[i].textContent = 0;
      squares[i].classList.add('resetChoice');
    }
  }
  /* AUX for startGame()
   Activates choice boxes (inside the choices div)
   to look responsive (cursor-pointer, colorchange on hover) */
  choices.start = function() {
    squares = choices.children;
    for (var i=0; i<squares.length; i++) {
      squares[i].classList.remove('resetChoice');
    }
  }
}

function resetGame() {
  gameState = 'ready';
  question.textContent = '';
  choices.reset();
  start_reset_button.innerHTML = 'Start Game';
  scoreDisplay.reset();
  timeDisplay.reset();
}

function startGame() {
  choices.start();
  nextQuestion();
  start_reset_button.innerHTML = 'Reset Game';
  startCountdown();
  gameState = 'playing';
}

function finishGame() {
  gameState = 'over';
  finalScoreDisplay = scoreValue;
  gameOverDisplay.style.visibility = 'visible';
  scoreDisplay.style.visibility = 'hidden';
  timeDisplay.style.visibility = 'hidden';
}

/* Generate a new question and init UI (question & choices) with the values */
function nextQuestion() {
  // generate values
  var qText = '5x5'; // TODO develop
  correctAnswer = '25'; // TODO develop
  // set question in UI
  question.textContent = qText;
  // set the choices in UI
  initChoices();
}
/* Randomly place the answer value in one of the four choice boxes
   and set random values for in other ones */
function initChoices() {
  // which choice should contain the correct answer?
  var correctSquare = Math.floor(Math.random()*4); // 0, 1, 2 or 3
  // set the choices in UI
  var squares = choices.children;
  for (var i=0; i<squares.length; i++) {
    squares[i].textContent = (i == correctSquare) ? correctAnswer : randomAnswer();
  }
}

// Starts the countdown. When finished, finishes the game
function startCountdown() {
  // ... begin
  // when over, finishGame();
}

// Handler for clicks on the start_reset_button
function clickOnStartReset() {
  gameState=='ready' ? startGame() : reset();
}

// Handler for clicks on choice boxes
// @param target - the box that has been clicked
function clickOnChoice(target) {
  if (! (gameState=='playing')) return;
  // else
  if (target.textContent == correctAnswer) {
    // ...rightAnswer();
  } else {
    // ...wrongAnswer();
  };
}

// AUX function
function randomAnswer() {
  return Math.random() * 100;
}
