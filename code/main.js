var gameState; // 'ready', 'playing', 'over'
var gameMode; // 'multiply', 'sqrt'

var correctAnswer;

var introButton;

var countDown;
var timer;
var questionFrame;
var question;
var choices;
var start_reset_button;
var scoreDisplay;
var scoreValueDisplay;
var timeDisplay;
var timeValueDisplay;
var feedbackCorrect;
var feedbackWrong;
var gameOverDisplay;
var finalScoreDisplay;

window.onload = () => {
  initGlobals();
  initEvents();
  resetGame();
}

/* Init references to the DOM*/
function initGlobals() {
	gameMode = 'multiply';

	introButton = document.getElementById('intro');
  question = document.getElementById('question');
  questionFrame = document.getElementById('questionFrame');
  modeButton = document.getElementById('gameModeButton');
  choices = document.getElementById('choices');
  choiceBoxes = choices.querySelectorAll('div');
  start_reset_button = document.getElementById('start_reset');
  scoreDisplay = document.getElementById('score');
  scoreValueDisplay = document.getElementById('scoreValue');
  timeDisplay = document.getElementById('timer');
  timeValueDisplay = document.getElementById('timeValue');
  feedbackCorrect = document.getElementById('feedbackCorrect');
  feedbackWrong = document.getElementById('feedbackWrong');
  gameOverDisplay = document.getElementById('gameOver');
  finalScoreDisplay = document.getElementById('finalScore');

  /* default value is click interaction, so that
  cursor is displayed correctly in case it's visible */
  stayTouchy = false;
  start_reset_button.classList.add('clicky');
	introButton.classList.add('clicky');
	

  // AUX for resetGame()
  scoreDisplay.reset = function() {
    this.style.visibility = 'visible';
    scoreValueDisplay.innerHTML = '0';
  }
  // AUX for resetGame()
  timeDisplay.reset = function() {
		this.classList.remove('running');
    this.style.visibility = 'visible';
		timeValueDisplay.innerHTML = countDown;
		timeValueDisplay.classList.remove('running');
  }
  // AUX for resetGame()
  choices.reset = function() {
    squares = choices.children;
    for (var i=0; i<squares.length; i++) {
      squares[i].querySelector('p').textContent = '';
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
  countDown = 60;
  window.clearInterval(timer);
  gameState = 'ready';
  modeButton.innerHTML = (gameMode == 'multiply') ? 'a x b' : '&radic;a';
  // button is visible when gameState is 'ready'
  modeButton.style.visibility = 'visible';
  question.style.display = 'none';
  question.classList.add('inReadyState');
  choices.reset();
  start_reset_button.classList.remove("finishedState");
  start_reset_button.innerHTML = 'Start';
  scoreDisplay.reset();
  timeDisplay.reset();
  gameOverDisplay.style.visibility = 'hidden';
}

function startGame() {
  modeButton.style.visibility = 'hidden';
  question.style.display = 'block';
  question.classList.remove('inReadyState');
  choices.start();
  nextQuestion();
  start_reset_button.innerHTML = 'Reset';
  startCountdown();
  gameState = 'playing';
}

function finishGame() {
  gameState = 'over';
  finalScoreDisplay.textContent = scoreValueDisplay.textContent;
  gameOverDisplay.style.visibility = 'visible';
  scoreDisplay.style.visibility = 'hidden';
  timeDisplay.style.visibility = 'hidden';
	choices.reset();
  start_reset_button.innerHTML = 'Again!';
  setTimeout( () => {start_reset_button.classList.add("finishedState")}, 1500);
}

/* Generate a new question and init UI (question & choices) with the values */
function nextQuestion() {
  // generate question
  gameMode == 'multiply' ? randomMultiplyQuestion() : randomSqrtQuestion();
  // set the choices in UI
  gameMode == 'multiply' ? initChoicesMultiplyQuestion() : initChoicesSqrtQuestion();
}

// Starts the countdown. When finished, finishes the game
function startCountdown() {
  var timerAction = () => {
    if (countDown > 0) {
      countDown--;
      timeValueDisplay.textContent = countDown;
    } else { // countDown == 0
      finishGame();
      window.clearInterval(timer);
    }
  };
  timer = window.setInterval(timerAction, 1000);
	timeDisplay.classList.add('running');
	timeValueDisplay.classList.add('running');
}

// Handler for clicks on the start_reset_button
function clickOnStart_Reset() {	
  gameState=='ready' ? startGame() : resetGame();
}

// Handler for clicks on choice boxes
// @param target - the box that has been clicked
function clickOnChoice(target) {
  if (! (gameState=='playing')) return;
  // else
  if (target.textContent == correctAnswer) {
    scoreValueDisplay.textContent = (Number(scoreValueDisplay.textContent) + 1);
    feedbackCorrect.style.visibility = 'visible';
    setTimeout(() => {feedbackCorrect.style.visibility = 'hidden';}, 500);
    nextQuestion();
  } else { // wrong answer
    feedbackWrong.style.visibility = 'visible';
    setTimeout(() => {feedbackWrong.style.visibility = 'hidden';}, 300);
  };
}

// Handler for gameModeButton clicks
// toggles gameModes
function changeGameMode() {
  if (gameMode == 'multiply') {
    gameMode = 'sqrt';
  } else {
    gameMode = 'multiply';
  }
  modeButton.innerHTML = (gameMode == 'multiply') ? 'a x b' : '&radic;a';
}

// AUX function that generates a question of multiplication of 2 integers
// between 1 and 10 (including). Also sets the global correctAnswer and
// loads the text into the UI
function randomMultiplyQuestion() {
  // generate random values
  var f1 = Math.ceil(Math.random() * 10);
  var f2 = Math.ceil(Math.random() * 10);
  var qText = f1+'x'+f2;
  correctAnswer = f1*f2;
  // set question in UI
  question.innerHTML = qText;
}
// AUX function that generates a question of square root for an integer
// between 0 and 200. Also sets the global correctAnswer and
// loads the text into the UI
function randomSqrtQuestion() {
  var initial = Math.floor(Math.random() * (625+1));
  question.innerHTML = '&radic;'+initial;
  correctAnswer = (Math.sqrt(initial)).toFixed(2);
}

/* Randomly place the answer value in one of the four choice boxes
   and set proper random values for in other ones */
function initChoicesMultiplyQuestion() {
  // which choice should contain the correct answer?
  var correctSquare = Math.floor(Math.random()*4); // 0, 1, 2 or 3
  // set the choices in UI
  var squares = choices.children;
  for (var i=0; i<squares.length; i++) {
    if (i == correctSquare) {
      squares[i].querySelector('p').textContent =  correctAnswer;
    } else {
      squares[i].querySelector('p').textContent = Math.round(Math.random() * 100);
    }
  }
}

/* Randomly place the answer value in one of the four choice boxes
   and set proper random values (2 decimals precision) in other ones */
function initChoicesSqrtQuestion() {
  // which choice should contain the correct answer?
  var correctSquare = Math.floor(Math.random()*4); // 0, 1, 2 or 3
  // set the choices in UI
  var squares = choices.children;
  for (var i=0; i<squares.length; i++) {
    if (i == correctSquare) {
      squares[i].querySelector('p').textContent =  correctAnswer;
    } else {
      squares[i].querySelector('p').textContent = (Math.random() * (25+1)).toFixed(2);
    }
  }
}

/*Eventhandling*/
function initEvents() {

	// TOGGLE BETWEEN THE 2 USER INTERFACE MODES

  document.addEventListener('mousedown', setUIMode);
	document.addEventListener('touchstart', setUIMode);
  document.addEventListener('mousemove', setUIMode);

  function setUIMode(ev) {
    var touchy = ev.type =='touchstart';

    if (touchy) {
      start_reset_button.classList.add('touchy');
      start_reset_button.classList.remove('clicky');
      for (var i=0; i<choiceBoxes.length; i++) {
        choiceBoxes[i].classList.add('touchy');
        choiceBoxes[i].classList.remove('clicky');
      }
      // prevent subsequent emulated clicks to return to clicky state.
      stayTouchy = true;
      window.setTimeout(function() {
        stayTouchy = false;
      }, 1000);
      // 1000 should be enough time. all clicks after that
      // would have to be "real" user clicks
    } else {
      // only change mode if event was a real user click.
      if (!stayTouchy) {
				// changing the mode only for start_reset_button and choice boxes.
				// The mode button behaves the same

        start_reset_button.classList.remove('touchy');
        start_reset_button.classList.add('clicky');
        for (var i=0; i<choiceBoxes.length; i++) {
          choiceBoxes[i].classList.remove('touchy');
          choiceBoxes[i].classList.add('clicky');
        }
      }
    }
  }

	// EVENT HANDLING in CLICK MODE

	introButton.onclick = beginExperience;
	modeButton.onclick = changeGameMode;
	start_reset_button.onclick = clickOnStart_Reset;
	
  // EVENT HANDLING in TOUCH MODE

	introButton.ontouchend = beginExperience;
		
  // modeButton and start_reset_button need no touch handling, will have click triggered by default
	// modeButton.ontouchend = changeGameMode;
	// start_reset_button.ontouchend = clickOnStart_Reset;
		
}

function beginExperience(ev) {
  ev.preventDefault();
			
	introButton.classList.add('away');
	
	var goFull = ev.type == 'touchend'; // touch
	
	if (goFull) {
		setTimeout(function() {
			// Launch fullscreen only for browsers that support it!
			launchIntoFullscreen(document.documentElement); 
		}, 550);	
	}	
	
	setTimeout(function() {
		introButton.style.display = 'none';
		document.getElementById('panel').classList.remove('hidden');
	}, 600);	
}

// Find the right method, call on correct element
function launchIntoFullscreen(element) {
  if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}
