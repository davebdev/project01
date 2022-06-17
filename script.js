// DECLARE ARRAYS USED

const currentOptions = []; // create an array for all possible words based on letters so far
const gameWordList = []; // wordlist of only x length words set in 'setOddsOrEvens' function

// DECLARE VARIABLES USED

let letterCounter = 0;
let currentWord = "";
let computerGuess = "";
let currentOptionsLength = 0;
let letterboxes = document.querySelectorAll(".letterbox");
let wordMatch = false;
let gameOver = false; // set state of game
let winner = "comp";
let userPoints = 0;
let compPoints = 0;

// GET ELEMENTS FROM DOM

const difficultyDiv = document.getElementById("difficulty");
const userPointsDiv = document.getElementById("userPointsDiv");
const compPointsDiv = document.getElementById("compPointsDiv");
const messageDiv = document.getElementById("message");
const wordDiv = document.getElementById("word");
const optionsDiv = document.getElementById("wordsLeft");
const claimButton = document.getElementById("claim");
const continueButton = document.getElementById("continue");
const resetButton = document.getElementById("reset");

// SET-UP / PAGE-MANIPULATION FUNCTIONS

function setOddsOrEvens(num) {
  console.log("function 1 - setOddsOrEvens");
  do {
    for (let i = 0; i < wordList.length; i++) {
      if (wordList[i].length === num) {
        gameWordList.push(wordList[i]);
      }
    }
    num = num + 2;
  } while (num < 24);
}

function createGameSpace(winner) {
  console.log("function 2 - createGameSpace");
  if (winner === "comp") {
    messageDiv.innerHTML = "";
    createNewUserInput();
    updatePoints();
    createDifficultySwitch();
  } else {
    messageDiv.innerHTML = "";
    computerGuess = ""; // clear computer guess
    const compWordsLength = gameWordList.length; // hold compWord array length in a variable
    const cwi = Math.floor(Math.random() * compWordsLength);
    computerGuess = gameWordList[cwi];
    const compLetter = computerGuess[0];
    createNewCompInput(compLetter);
    createNewUserInput();
    updatePoints();
    createDifficultySwitch();
  }
}

function updatePoints() {
  console.log("function 3 - updatePoints");
  userPointsDiv.innerHTML = "";
  compPointsDiv.innerHTML = "";
  const userPointsTitle = createDomElement("p", "USER");
  const userPointsDisplay = createDomElement("p", userPoints);

  const compPointsTitle = createDomElement("p", "COMPUTER");
  const compPointsDisplay = createDomElement("p", compPoints);

  userPointsDiv.appendChild(userPointsTitle);
  userPointsDiv.appendChild(userPointsDisplay);

  compPointsDiv.appendChild(compPointsTitle);
  compPointsDiv.appendChild(compPointsDisplay);
}

// GAMEPLAY FUNCTIONS

function createNewUserInput() {
  console.log("function 4 - createNewUserInput");
  const newUserInput = document.createElement("input");
  newUserInput.type = "text"; // make input type text
  newUserInput.maxLength = 1; // give input max length of 1
  newUserInput.classList.add("letterbox"); // add 'letterbox' class to input
  newUserInput.id = "letter-" + letterCounter; // give input unique id
  newUserInput.value = ""; // clear input value
  newUserInput.readOnly = false; // make input not readonly
  newUserInput.addEventListener("input", checkGuess);
  if (letterboxes.length > 1) {
    letterboxes.forEach((element) => element.removeAttribute("autofocus")); // remove autofocus for all other elements
  }
  newUserInput.setAttribute("autofocus", "");
  wordDiv.appendChild(newUserInput); // append input to div
}

function createNewCompInput(letter) {
  console.log("function 5 - createNewCompInput");
  const newCompInput = document.createElement("input"); // create new Input tag
  newCompInput.type = "text"; // make input type text
  newCompInput.maxLength = 1; // give input max length of 1
  newCompInput.classList.add("letterbox"); // add 'letterbox' class to input
  newCompInput.classList.add("compTurn"); // add 'comp' class to input
  newCompInput.id = "letter-" + letterCounter; // give input unique id
  newCompInput.value = letter; // give input value of computer's next letter
  newCompInput.readOnly = true; // make input readonly
  wordDiv.appendChild(newCompInput); // append input to div
  letterCounter = letterCounter + 1;
}

function checkGuess(e) {
  if (e.inputType === "insertText" && gameOver === false) {
    messageDiv.innerHTML = "";
    if (e.data.match(/[a-z]/)) {
      // checking functionality starts here
      console.log("function 6 - checkGuess");
      getCurrentWord();
      wordMatch = false;
      if (currentWord.length > 2) {
        checkCurrentWord();
      }
      updateCounter();
      console.log("Is word a match? ", wordMatch);
      if (wordMatch === true) {
        claimButton.removeAttribute("style");
        if (currentOptionsLength !== 0) {
          continueButton.removeAttribute("style");
        }
        updateCounter();
      } else {
        updateCounter();
        if (currentOptionsLength === 0) {
          messageDiv.innerHTML = "<p>Word does not exist... try again!</p>";
        } else {
          takeCompTurn();
        }
      }
      // checking functionality ends here
    }
  }
}

function getCurrentWord() {
  console.log("function 7 - getCurrentWord");
  currentWord = "";
  letterboxes = document.querySelectorAll(".letterbox"); // regenerate the letterboxes value based on what is currently on the page
  letterboxes.forEach((element) => (currentWord = currentWord + element.value)); // get current word by stringing values of all letterboxes together
  currentWord = currentWord.toLowerCase(); // change value to lower case
  console.log("current word: " + currentWord);
}

function checkCurrentWord() {
  console.log("function 8 - checkCurrentWord");
  const regex = new RegExp("^" + currentWord + "$");
  for (word of wordList) {
    if (word.match(regex)) {
      wordMatch = true;
      console.log("wordMatch: ", wordMatch);
      break;
    }
  }
}

function takeCompTurn() {
  console.log("function 9 - takeCompTurn");
  computerGuess = ""; // clear computer guess variable
  getCurrentWord();
  getCurrentOptions();
  const cwi = Math.floor(Math.random() * currentOptionsLength); // get random number to use as index
  computerGuess = currentOptions[cwi]; // assign random word from computer choices to computerGuess
  console.log("Computer guess: ", computerGuess);
  const compLetter = getCompNextLetter(computerGuess, currentWord.length);
  createNewCompInput(compLetter);
  getCurrentWord();
  wordMatch = false;
  if (currentWord.length > 3) {
    checkCurrentWord();
  }
  if (wordMatch === true) {
    updateCounter();
    compWins(currentWord);
  } else {
    if (currentOptionsLength === 0) {
      updateCounter();
      userWins();
    } else {
      updateCounter();
      createNewUserInput();
      document.getElementById("letter-" + letterCounter).focus(); // sets the cursor to be in the user guess box already
    }
  }
}

function userWins() {
  console.log("function 10 - userWins");
  gameOver = true;
  winner = "user";
  letterboxes = document.querySelectorAll(".letterbox");
  letterboxes.forEach((element) => element.classList.add("userWins")); // add compWins class to each letter
  messageDiv.innerHTML = "<p>You Win!</p>";
  userPoints = userPoints + currentWord.length;
  updatePoints();
  resetButton.removeAttribute("style");
  computerGuess = "";
}

function compWins(word) {
  console.log("function 11 - compWins");
  gameOver = true;
  winner = "comp";
  letterboxes = document.querySelectorAll(".letterbox");
  letterboxes.forEach((element) => element.classList.add("compWins")); // add compWins class to each letter
  messageDiv.innerHTML = "<p>You Lose!</p>";
  compPoints = compPoints + word.length;
  updatePoints();
  resetButton.removeAttribute("style");
  computerGuess = "";
}

function getCurrentOptions() {
  console.log("function 12 - getCurrentOptions");
  currentOptions.length = 0;
  const regex = new RegExp("^" + currentWord + "."); // create regex using that value - '^' means any match that starts with
  for (const word of wordList) {
    // for loop running through word list
    if (word.match(regex)) {
      // if regex matches word
      currentOptions.push(word); // add it to 'currentOptions' array
    }
  }
  currentOptionsLength = currentOptions.length;
}

function getCompNextLetter(word, length) {
  console.log("function 13 - getCompNextLetter");
  let letter = "";
  letter = word.slice(length, length + 1); // get computer's next letter (first letter of computer's guess after current word so far)
  return letter;
}

function resetGameSpace() {
  console.log("function 14 - resetGameSpace");
  wordDiv.innerHTML = "";
  messageDiv.innerHTML = "";
  letterCounter = 0;
  currentWord = "";
  computerGuess = "";
  currentOptionsLength = 0;
  letterboxes = document.querySelectorAll(".letterbox");
  wordMatch = false;
  gameOver = false;
  createGameSpace(winner);
  updateCounter();
  resetButton.style.display = "none";
  claimButton.style.display = "none";
  continueButton.style.display = "none";
  document.getElementById("letter-" + letterCounter).focus(); // sets the cursor to be in the user guess box already
}

function continueGame() {
  console.log("function 15 - continueGame");
  claimButton.style.display = "none";
  continueButton.style.display = "none";
  takeCompTurn();
}

function claimPoints() {
  console.log("function 16 - claimPoints");
  claimButton.style.display = "none";
  continueButton.style.display = "none";
  userWins();
}

function updateCounter() {
  console.log("function 17 - updateCounter");
  getCurrentOptions();
  optionsDiv.innerHTML = "<p>Options left: " + currentOptionsLength + "</p>";
}

function instructions() {
  console.log("function 18 - instructions");
  messageDiv.innerHTML = "";

  const instructionsTitle = createDomElement("h2", "How to Play");
  const instructionsList = createDomElement("ol", "");
  const instruction1 = createDomElement(
    "li",
    "Enter the first letter of a word you're trying to build"
  );
  const instruction2 = createDomElement(
    "li",
    "The computer will then take a turn entering the next letter"
  );
  const instruction3 = createDomElement(
    "li",
    "Whichever player enters the final letter of the word wins the points"
  );
  const okButtonP = createDomElement("p", "");
  const okButton = createDomElement("button", "OK");
  okButton.addEventListener("click", createGameSpace);
  okButtonP.appendChild(okButton);
  instructionsList.appendChild(instruction1);
  instructionsList.appendChild(instruction2);
  instructionsList.appendChild(instruction3);
  messageDiv.appendChild(instructionsTitle);
  messageDiv.appendChild(instructionsList);
  messageDiv.appendChild(okButtonP);
}

function createDomElement(el, text) {
  console.log("function 19 - createDomElement");
  const element = document.createElement(el);
  element.textContent = text;
  return element;
}

function createDifficultySwitch() {
  difficultyDiv.innerHTML = "";
  const switchInput = document.createElement("input");
  switchInput.type = "checkbox";
  switchInput.id = "hardmode";
  switchInput.addEventListener("click", toggleHardMode);
  const switchSpan = document.createElement("span");
  switchSpan.classList.add("slider", "round");
  const switchLabel = document.createElement("label");
  switchLabel.classList.add("switch");
  switchLabel.appendChild(switchInput);
  switchLabel.appendChild(switchSpan);
  difficultyDiv.appendChild(switchLabel);
  const difficultyLabel = createDomElement("p", "HARD MODE");
  difficultyLabel.id = "difficultyLabel";
  difficultyDiv.appendChild(difficultyLabel);
}

function toggleHardMode() {
  const hardMode = document.getElementById("hardmode").checked;
  if (hardMode === true) {
    console.log("Hard Mode ON");
  } else {
    console.log("Hard Mode OFF");
  }
}

// STARTING PAGE FUNCTIONS
setOddsOrEvens(1);
instructions();

document.getElementById("claim").addEventListener("click", claimPoints);
document.getElementById("continue").addEventListener("click", continueGame);
document.getElementById("reset").addEventListener("click", resetGameSpace);
