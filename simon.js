// Variables
let title1 = 'Simon Game';
let orderArr = [];
let actualLevel = 0;
let clickedCount = 0;
let timeout = 500;
let startLabel = "Wait for the computer!";
let hellModeText = "Activate Hell Mode? If you lose, you will restart with a new Pattern";

// CSS variables
const ligthButton = "button-border-start";
const hide = "hide";

// DOM variables
let title = document.getElementById("dinamicTitle");
let startButton = document.getElementById("button-start");
let reStartButton = document.getElementById("button-reStart");
let newGameButton = document.getElementById("button-newGame");
let countLevel = document.getElementById("count-label");
let hellMode = document.getElementById("hellMode-section");
let hellModeLabel = document.getElementById("labelForHellMode");
let hellModeChbox = document.getElementById("hellModeChbox");

let buttonOne = document.getElementById("button-one");
let buttonTwo = document.getElementById("button-two");
let buttonThree = document.getElementById("button-three");
let buttonFour = document.getElementById("button-four");

// Audio settings
const a1 = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3");
const a2 = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3");
const a3 = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3");
const a4 = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3");

// Saving buttons DOM and audio
const buttons = [
    {
        button: buttonOne,
        audio: a1
    },
    {
        button: buttonTwo,
        audio: a2
    },
    {
        button: buttonThree,
        audio: a3
    },
    {
        button: buttonFour,
        audio: a4
    },
]

// Disabled Buttons since the page is loaded
disableButtons();

// Function used to launch game
function startSimon() {
    clickedCount = 0;
    hellModeLabel.textContent = hellModeText;
    countLevel.classList.remove(hide);
    countLevel.textContent = `${startLabel}`;
    startButton.classList.add(hide);
    newGameButton.classList.add(hide);
    orderSelect();
    newLevel();
}

// Function used to restart game with the same pattern, only available on user turn after game started
function reStartSimon() {
    actualLevel = 0;
    clickedCount = 0;
    newLevel();
}

// Function used to create a new game, used only if the #hellModeChbox is checked or the user win the game 
function newGame() {
    actualLevel = 0;
    startSimon();
}

// Function used to create a random pattern for the game. Only 20 steps
function orderSelect() {
    orderArr = [];
    for (let count = 0; count < 20; count++) {
        orderArr.push(Math.floor(Math.random() * 4));
    }
}

// This function is used to play the sequence of the machine and the user have to replicate the pattern
function playSequence() {
    reStartButton.classList.add(hide);
    hellMode.classList.add(hide);
    for (let sequenceCount = 0; sequenceCount < actualLevel; sequenceCount++) {
        const actualSequence = orderArr[sequenceCount];
        setTimeout(() => {
            turnOnButtonLigth(buttons[actualSequence]['button'], buttons[actualSequence]['audio']);
            setTimeout(() => {
                turnOffButtonLigth();
                sequenceCount === actualLevel - 1 ? enabledButtons() : null;
            }, 500);
        },sequenceCount * 1000);
    }
}

// This Functions is activated when the user click on any color button and its used to save the answer
// of the user and also change the css to make it look clicked on it
function countSimon(element) {
    button = buttons.find(({button}) => button === element);
    disableButtons();
    setTimeout(() => {
        turnOnButtonLigth(button['button'], button['audio']);
        setTimeout(() => {
            turnOffButtonLigth();
            buttons.forEach( (element, index) => { element === button ? verifySimon(index) : null });
        }, 500);
    },10 );
}

// this function verify if the answer of the user is correct or not also verify if the user won the game
function verifySimon(value) {
    clickedCount+=1;
    value === orderArr[clickedCount - 1] ?
        (clickedCount === 20 ? simonWin() : simonPassed()) : simonFailed()
}

// if the user win, Show a Congratulation message and hide #button-reStart, #hellModeChbox and also sow
// the New Game button. Then, the color buttons are disabled again.
function simonWin() {
    title.textContent = `Level ${actualLevel} of 20 Completed!! Congratulations!!!`;
    countLevel.textContent = `You won this time (*-*)`;
    reStartButton.classList.add(hide);
    hellMode.classList.add(hide);
    newGameButton.classList.remove(hide);
    actualLevel = 0;
    disableButtons();
}

// This function verify if the user is clearing the level or a step, if dont clear a leve, the color
// buttons are enabled
function simonPassed() {clickedCount
    countLevel.classList.remove(hide);
    countLevel.textContent = `Step ${clickedCount} of ${actualLevel}`;
    setTimeout(() => {
        clickedCount === actualLevel ? newLevel() : enabledButtons();
    },500 );
}

// if the user didn't passed the step it show a fail message, hide #button-reStart and #hellModeChbox
// if #hellModeChbo was checked it strart a new game if not, it play the sequence of the actual level
function simonFailed() {
    clickedCount = 0;
    title.textContent = `You Failed, Try Again!!`;
    countLevel.textContent = `${startLabel}`;
    reStartButton.classList.add(hide);
    hellMode.classList.add(hide);
    setTimeout(() => {
        hellModeChbox.checked ? newGame() : playSequence();
        title.textContent = `Level ${actualLevel} of 20`;
        countLevel.textContent = `${startLabel}`;
    },2000 );
}

// Function used to disabling color buttons
function disableButtons() {
    buttonOne.disabled = true;
    buttonTwo.disabled = true;
    buttonThree.disabled = true;
    buttonFour.disabled = true;
}

// Function used for enable color buttons, remove hide and change text
function enabledButtons() {
    reStartButton.classList.remove(hide);
    hellMode.classList.remove(hide);
    countLevel.classList.remove(hide);
    countLevel.textContent = `Step ${clickedCount} of ${actualLevel}`;
    buttonOne.disabled = false;
    buttonTwo.disabled = false;
    buttonThree.disabled = false;
    buttonFour.disabled = false;
    reStartButton.disabled = false;
    hellMode.disabled = false;
}

// Function used to remove #button-border-start class from color buttons when finished settimeout event
function turnOffButtonLigth() {
    buttonOne.classList.remove(ligthButton);
    buttonTwo.classList.remove(ligthButton);
    buttonThree.classList.remove(ligthButton);
    buttonFour.classList.remove(ligthButton);
}

// Function used to add #button-border-start class from color buttons when start settimeout event
// and also to play the button audio
function turnOnButtonLigth(button, audio) {
    button.classList.add(ligthButton);
    audio.play();
}

// This Function is used to add a new level, also hide #button-reStart and #hellModeChbox while
// the sequence is being played and disabled #button-reStart and #hellModeChbox in case that bouth get showed
// shows a congratulations message for clearing the previous level
function newLevel() {
    countLevel.textContent = `${startLabel}`;
    reStartButton.classList.add(hide);
    hellMode.classList.add(hide);
    clickedCount = 0;
    actualLevel > 0 ? title.textContent = `Amazing!! level ${actualLevel} cleared!!!` : null;
    reStartButton.disabled = clickedCount > 0 ? false : true;
    hellMode.disabled = clickedCount > 0 ? false : true;
    actualLevel+=1;
    setTimeout(() => {
        title.textContent = `Level ${actualLevel} of 20`;
        playSequence();
    },2000 );
}