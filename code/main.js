var touchy; // touch or mouse interface?

var gameState; // 'ready', 'playing', 'over'
var gameMode; // 'multiply', 'sqrt'

var correctAnswer;

var background1;
var background2;
var arrow;

var intro;
var panel;
var countDown;
var timer;
var questionFrame;
var question;
var choices;
var masterButton;
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
  touchy = false;

	gameMode = 'multiply';

	background1 = document.getElementsByClassName('background1')[0];
	background2 = document.getElementsByClassName('background2')[0];

	intro = document.getElementById('intro');
	panel = document.getElementById('panel');
	arrow = document.getElementById('arrow');
  question = document.getElementById('question');
  questionFrame = document.getElementById('questionFrame');
  modeButton = document.getElementById('gameModeButton');
  choices = document.getElementById('choices');
  choiceBoxes = choices.querySelectorAll('div');
  masterButton = document.getElementById('master');
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
  masterButton.classList.add('clicky');


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

/* called from within the game (gamestate == 'playing')
  or at the end of the game (gamestate == 'over'),
	after pressing the master button */
function resetGame() {
	// clean up UI
  countDown = 20;
  window.clearInterval(timer);
  modeButton.innerHTML = (gameMode == 'multiply') ? 'a x b' : '&radic;a';
  question.style.display = 'none';

  question.classList.add('inReadyState');
  choices.reset();
	scoreDisplay.reset();
  timeDisplay.reset();
  gameOverDisplay.style.visibility = 'hidden';

	if (gameState == 'over') {
		masterButton.classList.remove("finishedState");
	}

	masterButton.innerHTML = 'Start';
	gameState = 'ready';
	modeButton.style.visibility = 'visible';
}

function startGame() {
  modeButton.style.visibility = 'hidden';
  question.style.display = 'block';
  question.classList.remove('inReadyState');
  choices.start();
  nextQuestion();
  masterButton.innerHTML = 'Reset';
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
	masterButton.classList.remove('inGame');
  masterButton.innerHTML = 'Again!';
  setTimeout( () => {masterButton.classList.add("finishedState")}, 1500);
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

/*Handler when pressed (click or touch) masterButton
  Button may be in start-state, reset-state or again-state.
	Dispatching execution flow according to button state.

	- uses css classes to animate (transition) the button while being pressed
	- starts the game or resets the game, depending on the game state.
			- executed at the midpoint of the "clicked" visual feedback
*/
function pressedMaster(ev) {
	if (gameState === 'over') { // button is in again-state
		// visual feedback
		masterButton.classList.add('pressed-again');
		masterButton.addEventListener('animationend', function() {}, {once:true});
		// at the moment nothing to do in the handler
		// moving on with game logic - while animation running
		resetGame();
		return;
	}

	// button is in reset-state or start-state

	if (gameState === 'playing') { // button is in reset-state
		// visual feedback
		masterButton.classList.add('pressed-reset');
		masterButton.addEventListener('transitionend', btnResetTransEnd);
		// logic executed within event handler
		return;
	}

	// else - gameState === 'ready' /  button is in start-state

	// visual feedback
	masterButton.classList.add('pressed-start');
	masterButton.addEventListener('transitionend', btnStartTransEnd);
	// logic executed within event handler
	return;
}


/* handler for ending of transitions at masterButton in reset-state.
- reset the game
- set css classes as they were before button was pressed*/
function btnResetTransEnd(ev) {
	/* only execute for the transition with longest duration. currently it's transform */
	if (ev.propertyName !== 'transform')
		return;
	// moving on with game logic
	resetGame();
	masterButton.removeEventListener('transitionend', btnResetTransEnd); // not needed anymore
	masterButton.classList.remove('pressed-reset'); // will produce transition back
	// handle the transition end event
	masterButton.addEventListener('transitionend', function() {
		masterButton.classList.remove('inGame');
	}, {once: true});
}


/* handler for ending of transitions at masterButton.
- start game
- set css classes as they were before button was pressed*/
function btnStartTransEnd(ev) {

	/* only execute for the transition with longest duration. currently it's transform */
	if (ev.propertyName !== 'transform')
		return;
	// moving on with game logic
	startGame();
	masterButton.removeEventListener('transitionend', btnStartTransEnd); // not needed anymore
	masterButton.classList.remove('pressed-start'); // will produce transition back
	// handle the transition end event
	masterButton.addEventListener('transitionend', function() {
		masterButton.classList.add('inGame');
	}, {once: true});
}


/*Handler when pressed (click or touch) gameModeButton
	- uses css classes to animate (transition) the button while being pressed
	- changes game mode at the midpoint of the "clicked" visual feedback
*/
function pressedModeButton(ev) {
	ev.preventDefault(); // no click emulation needed, if as touch handler
	// visuals
	modeButton.classList.add('pressed2');
  modeButton.addEventListener('transitionend', btnModeTransEnd);
	// game logic triggered inside the above handler
}

/* handler for ending of transitions at gameMode button.
will change the game mode
will set css classes as they were before button was pressed
will remove the listener for transition ends*/
function btnModeTransEnd(ev) {
	/* only execute for the transition with longest duration. currently it's transform */
	if (ev.propertyName !== 'transform')
		return;

	changeGameMode();
	modeButton.classList.remove('pressed2');
	modeButton.removeEventListener('transitionend', btnModeTransEnd);
}

// Handler for clicks on choice boxes. Also used for touch event handling (no prevent default)
// visual feedback handled via css states (active)
function clickOnChoice(ev) {
  if (! (gameState=='playing')) return;
  // else

  if (ev.target.textContent == correctAnswer) {
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

  checkForParallax();

  // TOGGLE BETWEEN THE 2 USER INTERFACE MODES
  document.addEventListener('mousedown', setUIMode);
	document.addEventListener('touchstart', setUIMode);
  document.addEventListener('mousemove', setUIMode);
  window.addEventListener('resize', checkForParallax);

  function setUIMode(ev) {
    touchy = ev.type =='touchstart';

    if (touchy) {
      masterButton.classList.add('touchy');
      masterButton.classList.remove('clicky');
			choiceBoxes.forEach(function(elem) {
				elem.classList.add('touchy');
        elem.classList.remove('clicky');
			});
      // prevent subsequent emulated clicks to return to clicky state.
      stayTouchy = true;
      window.setTimeout(function() {
        stayTouchy = false;
      }, 500);
      // 500 should be enough time. all clicks after that
      // would have to be "real" user clicks
    } else {
      // only change mode if event was a real user click.
      if (stayTouchy) {
        touchy = true;
      } else {
				// changing the mode only for masterButton and choice boxes.
				// The mode button behaves the same
        masterButton.classList.remove('touchy');
        masterButton.classList.add('clicky');
        choiceBoxes.forEach(function(elem) {
          elem.classList.remove('touchy');
          elem.classList.add('clicky');
        });
      }
    }
  }

	// CLICK MODE

	modeButton.onclick = pressedModeButton;
	masterButton.onclick = pressedMaster;

	choiceBoxes.forEach(function(elem) {
		elem.addEventListener('click', clickOnChoice);
	});

	// TOUCH MODE

  // modeButton and masterButton need no touch handling,
	// gonna use click triggered by default
}

function checkForParallax() {
  if (window.innerWidth >= 992) {
    // parallax effect
    window.addEventListener('scroll', monitorScroll);
    // background2.style.display = 'initial';
  } else {
    window.removeEventListener('scroll', monitorScroll);
    // background2.style.display = 'none';
  }
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

/* Event handler for pressing the arrow on the welcome view.
Tries going fullscreen, then scrolls down smoothly to game panel*/
function goDown() {

  // cannot listen for fullscreen event, it is only fired when requestFullscreen is executed.
  // as of now, the only working method in chrome is webkitfullscreenchange.
  // will catch the cases of going fullscreen within the resize-listener.

  // var goneDown = false;
  // document.documentElement.addEventListener('webkitfullscreenchange mozfullscreenchange fullscreenchange', function() {
  //   checkForParallax(); // if fullscreen, perhaps parallax is possible
  //   // scroll down
  //   document.getElementById('panel').scrollIntoView({
  //       behavior: 'smooth'
  //     });
  //   goneDown = true;
  // }, {once:true}); // executed once, at most - not necessary to remove listener within handler
  console.log(touchy, 'before fullscreen');
  if (touchy) {
      launchIntoFullscreen(document.documentElement);
  }

  setTimeout(() => {
    document.getElementById('panel').scrollIntoView({
        behavior: 'smooth'
      });
  }, 400);

}

/* handles parallax effect */
function monitorScroll() {
	var wScroll = window.scrollY;
	var panelY = intro.offsetHeight; // Y where the panel begins

	background1.style.backgroundPositionY = (wScroll)*1/2+'px';
	background2.style.backgroundPositionY = (wScroll)*1/25+'px';

	/*if (!panel.visible && wScroll + window.innerHeight > panelY*1.5) { // panel has come into view
		panel.classList.remove('hidden');
		panel.classList.add('shown');
	}*/
}
