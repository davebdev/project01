// DECLARE ARRAYS USED

const currentOptions = []; // create an array for all possible words based on letters so far
const gameWordList = []; // wordlist of only x length words set in 'setGameDifficulty' function

// DECLARE VARIABLES USED

let letterCounter = 0;
let currentWord = "";
let computerGuess = "";
let currentOptionsLength = 0;
let letterboxes = document.querySelectorAll(".letterbox");
let wordMatch = false;
let gameOver = false; // set state of game
let winner = "user";
let userPoints = 0;
let compPoints = 0;

// GET ELEMENTS FROM DOM

const messageDiv = document.getElementById("message");
const wordDiv = document.getElementById("word");
const playAgainDiv = document.getElementById("playAgain");
const choiceDiv = document.getElementById("choice");

// SET-UP / PAGE-MANIPULATION FUNCTIONS

function setGameDifficulty(num) {
  console.log("function 1 - setGameDifficulty");
  for (word of wordList) {
    if (word.length <= num) {
      gameWordList.push(word);
    }
  }
}

function createGameSpace(winner) {
  console.log("function 2 - createGameSpace");
  if (winner === "comp") {
    createNewUserInput();
  } else {
    computerGuess = ""; // clear computer guess
    const compWordsLength = gameWordList.length; // hold compWord array length in a variable
    const cwi = Math.floor(Math.random() * compWordsLength);
    computerGuess = gameWordList[cwi];
    const compLetter = computerGuess[0];
    createNewCompInput(compLetter);
    createNewUserInput();
  }
}

function updatePoints() {
  console.log("function 3 - updatePoints");
  document.getElementById("userPoints").innerHTML = "<p>" + userPoints + "</p>";
  document.getElementById("compPoints").innerHTML = "<p>" + compPoints + "</p>";
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
    if (e.data.match(/[a-z]/)) {
      // checking functionality starts here
      console.log("function 6 - checkGuess");
      getCurrentWord();
      if (currentWord.length > 2) {
        checkCurrentWord();
      }
      console.log("Is word a match? ", wordMatch);
      if (wordMatch === true) {
        choiceDiv.removeAttribute("style");
      } else {
        takeCompTurn();
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
  wordMatch = false;
  const regex = new RegExp("^" + currentWord + "$");
  for (word of wordList) {
    if (word.match(regex)) {
      wordMatch = true;
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
  if (currentWord.length > 3) {
    checkCurrentWord();
  }
  if (wordMatch === true) {
    compWins(currentWord);
  } else {
    if (currentOptionsLength === 0) {
      userWins();
    } else {
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
  playAgainDiv.removeAttribute("style");
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
  playAgainDiv.removeAttribute("style");
  computerGuess = "";
}

function getCurrentOptions() {
  console.log("function 12 - getCurrentOptions");
  currentOptions.length = 0;
  const regex = new RegExp("^" + currentWord); // create regex using that value - '^' means any match that starts with
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
  //   countWordsLeft();
  playAgainDiv.style.display = "none";
  choiceDiv.style.display = "none";
  document.getElementById("letter-" + letterCounter).focus(); // sets the cursor to be in the user guess box already
}

// STARTING PAGE FUNCTIONS
setGameDifficulty(7);
createGameSpace(winner);
updatePoints();

document.getElementById("claim").addEventListener("click", userWins);
document.getElementById("continue").addEventListener("click", takeCompTurn);
document.getElementById("reset").addEventListener("click", resetGameSpace);
