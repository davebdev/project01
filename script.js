// declare arrays used

const currentPossibilities = []; // create an array for all possible words based on letters so far
const compWords = []; // create an array for all the longest words the computer has to choose from
const difficultySetWordList = []; // wordlist of only x length words set in 'setGameDifficulty' function

// declare variables used

let letterCounter = 0;
let currentWord = "";
let letterboxes = document.querySelectorAll(".letterbox");
let gameOver = false; // set state of game
let winner = "comp";
let currentPossibilitiesLength = 0;
let userPoints = 0;
let compPoints = 0;

// get elements from html

const messageDiv = document.getElementById("message");
const wordDiv = document.getElementById("word");
const playAgainDiv = document.getElementById("playAgain");

// SET UP / PAGE MANIPULATION FUNCTIONS

function setGameDifficulty(num) {
  for (word of wordList) {
    if (word.length <= num) {
      difficultySetWordList.push(word);
    }
  }
}

function createGameSpace(winner) {
  if (winner === "comp") {
    createNewUserInput();
  } else {
    takeFirstCompTurn();
    createNewUserInput();
    document.getElementById("letter-" + letterCounter).focus(); // sets the cursor to be in the user guess box already
  }
}

function updatePoints() {
  document.getElementById("userPoints").innerHTML = "<p>" + userPoints + "</p>";
  document.getElementById("compPoints").innerHTML = "<p>" + compPoints + "</p>";
}

function resetGameSpace() {
  console.log("game reset");
  letterCounter = 0;
  currentWord = "";
  gameOver = false;
  currentPossibilitiesLength = 0;
  wordDiv.innerHTML = "";
  messageDiv.innerHTML = "";
  createGameSpace(winner);
  playAgainDiv.style.display = "none";
  document.getElementById("letter-" + letterCounter).focus(); // sets the cursor to be in the user guess box already
}

// GAMEPLAY FUNCTIONS

function getCurrentWord() {
  letterboxes = document.querySelectorAll(".letterbox"); // regenerate the letterboxes value based on what is currently on the page
  letterboxes.forEach((element) => (currentWord = currentWord + element.value)); // get current word by stringing values of all letterboxes together
  currentWord = currentWord.toLowerCase(); // change value to lower case
  console.log("current word:" + currentWord);
}

function getCurrentPossibilities() {
  const regex = new RegExp("^" + currentWord); // create regex using that value - '^' means any match that starts with
  //   console.log(regex); // testing regex
  for (const word of difficultySetWordList) {
    // for loop running through word list
    if (word.match(regex)) {
      // if regex matches word
      currentPossibilities.push(word); // add it to 'currentPossibilities' array
    }
  }
  currentPossibilitiesLength = currentPossibilities.length;
  console.log(
    "getCurrentPossibilities (length): " + currentPossibilitiesLength
  );
}

function createNewUserInput() {
  const newUserInput = document.createElement("input");
  newUserInput.type = "text"; // make input type text
  newUserInput.maxLength = 1; // give input max length of 1
  newUserInput.classList.add("letterbox"); // add 'letterbox' class to input
  newUserInput.id = "letter-" + letterCounter; // give input unique id
  newUserInput.value = ""; // clear input value
  newUserInput.readOnly = false; // make input not readonly
  newUserInput.addEventListener("keypress", checkGuess);
  if (letterboxes.length > 1) {
    letterboxes.forEach((element) => element.removeAttribute("autofocus")); // remove autofocus for all other elements
  }
  newUserInput.setAttribute("autofocus", "");
  wordDiv.appendChild(newUserInput); // append input to div
}

function checkGuess(e) {
  if (e.key === "Enter") {
    currentPossibilities.length = 0; // empties array
    currentWord = ""; // clear currentWord so fresh check can be made
    messageDiv.innerHTML = "";
    letterboxes = document.querySelectorAll(".letterbox");

    getCurrentWord();
    getCurrentPossibilities();

    if (currentPossibilities.length === 0) {
      console.log("Word does not exist");
      messageDiv.innerHTML = "<p>Word doesn't exist. Try again...</p>";
      document.getElementById("letter-" + letterCounter).value = "";
    } else {
      letterCounter = letterCounter + 1;
      e.target.setAttribute("readonly", "");
      takeCompTurn();
      if (gameOver === false) {
        createNewUserInput();
        document.getElementById("letter-" + letterCounter).focus(); // sets the cursor to be in the user guess box already
      }
    }
  }
  console.log("END OF CHECKGUESS FUNCTION");
}

function getCompOptions() {
  compWords.length = 0; // clear compWords array
  for (const word of currentPossibilities) {
    // for all words that are longer than current word, push to compWords array
    if (word.length > currentWord.length) {
      compWords.push(word);
    }
  }
}

function createNewCompInput(letter) {
  const newCompInput = document.createElement("input"); // create new Input tag
  newCompInput.type = "text"; // make input type text
  newCompInput.maxLength = 1; // give input max length of 1
  newCompInput.classList.add("letterbox"); // add 'letterbox' class to input
  newCompInput.classList.add("comp"); // add 'comp' class to input
  newCompInput.id = "letter-" + letterCounter; // give input unique id
  newCompInput.value = letter; // give input value of computer's next letter
  newCompInput.readOnly = true; // make input readonly
  wordDiv.appendChild(newCompInput); // append input to div
  letterCounter = letterCounter + 1;
}

function getCompNextLetter(word, length) {
  let letter = "";
  letter = word.slice(length, length + 1); // get computer's next letter (first letter of computer's guess after current word so far)
  console.log("computer next letter:" + letter);
  if (word.length === length + 1) {
    messageDiv.innerHTML = "<p>You Lose!</p>";
    computerGuess = "You win, computer!";
    gameOver = true;
    winner = "comp";
    compPoints = compPoints + word.length;
    updatePoints();
    playAgainDiv.removeAttribute("style");
    console.log("Comp points: " + compPoints);
  } else {
    console.log("getCompNextLetter: computer doesn't win yet");
  }
  return letter;
}

function takeCompTurn() {
  const currentWordLength = currentWord.length; // get length of word so far
  getCurrentPossibilities();
  getCompOptions();
  let computerGuess = ""; // declare computer's guess variable
  const compWordsLength = compWords.length; // hold compWord array length in a variable
  console.log("takeCompTurn: " + compWordsLength);
  if (compWordsLength === 0) {
    // if array length is 0, no more matching words for computer
    messageDiv.innerHTML = "<p>You Win!</p>";
    computerGuess = "No more moves for you, computer!";
    gameOver = true;
    winner = "user";
    userPoints = userPoints + currentWordLength;
    updatePoints();
    playAgainDiv.removeAttribute("style");
    console.log("User points: " + userPoints);
  } else if (compWordsLength === 1 && compWords[0] === currentWord) {
    messageDiv.innerHTML = "<p>You Win!</p>";
    computerGuess = "No more moves for you, computer!";
    gameOver = true;
    winner = "user";
    updatePoints();
    userPoints = userPoints + currentWordLength;
    playAgainDiv.removeAttribute("style");
    console.log("User points: " + userPoints);
  } else if (compWordsLength === 1 && compWords[0] !== currentWord) {
    // if array length is 1, there is only one option for computer
    computerGuess = compWords[0];
    const compNextLetter = getCompNextLetter(computerGuess, currentWordLength);
    createNewCompInput(compNextLetter);
  } else if (compWordsLength > 1) {
    // if array length is more than one, choose an option at random
    const cwi = Math.floor(Math.random() * compWordsLength);
    computerGuess = compWords[cwi];
    const compNextLetter = getCompNextLetter(computerGuess, currentWordLength);
    createNewCompInput(compNextLetter);
  } else {
    // error catching
    computerGuess = "Error";
  }
  console.log("computer guess: " + computerGuess);
}

function takeFirstCompTurn() {
  getCurrentPossibilities();
  getCompOptions();
  let computerGuess = ""; // declare computer's guess variable
  const compWordsLength = compWords.length; // hold compWord array length in a variable
  const cwi = Math.floor(Math.random() * compWordsLength);
  computerGuess = compWords[cwi];
  const compLetter = computerGuess[0];
  console.log(compLetter);
  createNewCompInput(compLetter);
}

// Onload Page Actions

setGameDifficulty(7);
createGameSpace(winner);
updatePoints();

document.getElementById("letter-0").addEventListener("keypress", checkGuess);
document.getElementById("reset").addEventListener("click", resetGameSpace);
