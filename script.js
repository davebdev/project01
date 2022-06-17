// DECLARE ARRAYS USED

const currentOptions = []; // create an array for all possible words based on letters so far
// const gameWordList = []; // wordlist of only x length words set in 'setOddsOrEvens' function

// DECLARE VARIABLES USED

let letterCounter = 0; // used to keep track of how many letters are on the page at any given time
let currentWord = ""; // holds what is currently the partial word based on each of the letters entered so far
let computerGuess = ""; // used in the takeCompTurn() function, holds the word the computer is aiming for
let currentOptionsLength = 0; // used to count the array that holds the current possibilities based on the word so far
let letterboxes = document.querySelectorAll(".letterbox"); // creates a HTML collection of all current inputs on the page
let strikes = document.querySelectorAll(".strike"); // creates a HTML collection of all current strikes when in Hard Mode
let wordMatch = false; // used in the checking of whether currentWord is a match with an entry of the wordList
let gameOver = false; // set state of game
let winner = "comp"; // sets the Computer as the winner of round, so that the user starts first
let winnerTotal = ""; // eventually used to hold winner of total game
let userPoints = 0; // holds count of user points
let compPoints = 0; // holds count of computer points
let hardModeOn = false; // holds state of Hard Mode (false = off, true = on). Hard Mode starts in the off position
let strikeCount = 0; // counts how many strikes the user has gone through in Hard Mode
let numPointsToWin = 20; // holds how many points the winner has to reach for each round to win

// LOCAL STORAGE USED TO STORE NUMBER OF GAMES WON

// localStorage.setItem("userGamesWon", 0);
// localStorage.setItem("compGamesWon", 0);

// GET ELEMENTS FROM DOM

const difficultyDiv = document.getElementById("difficulty");
const userPointsDiv = document.getElementById("userPointsDiv");
const compPointsDiv = document.getElementById("compPointsDiv");
const messageDiv = document.getElementById("message");
const wordDiv = document.getElementById("word");
const optionsDiv = document.getElementById("wordsLeft");
const claimButton = document.getElementById("claim");
const continueButton = document.getElementById("continue");
const playAgainButton = document.getElementById("playAgain");
const newGameButton = document.getElementById("refresh");

// SET-UP / PAGE-MANIPULATION FUNCTIONS

// function setOddsOrEvens(num) {
//   console.log("function 1 - setOddsOrEvens");
//   do {
//     for (let i = 0; i < wordList.length; i++) {
//       if (wordList[i].length === num) {
//         gameWordList.push(wordList[i]);
//       }
//     }
//     num = num + 2;
//   } while (num < 24);
// }

function createGameSpace(winner) {
  console.log("function 2 - createGameSpace");
  if (winner === "comp") {
    messageDiv.innerHTML = "";
    createNewUserInput();
    document.getElementById("letter-" + letterCounter).focus(); // sets the cursor to be in the user guess box already
    updatePoints();
    createDifficultySwitch();
    letterCounter = letterCounter + 1;
  } else {
    messageDiv.innerHTML = "";
    computerGuess = ""; // clear computer guess
    const compWordsLength = wordList.length; // hold compWord array length in a variable
    const cwi = Math.floor(Math.random() * compWordsLength);
    computerGuess = wordList[cwi];
    const compLetter = computerGuess[0];
    createNewCompInput(compLetter);
    createNewUserInput();
    document.getElementById("letter-" + letterCounter).focus(); // sets the cursor to be in the user guess box already
    updatePoints();
    createDifficultySwitch();
    letterCounter = letterCounter + 1;
  }
}

function updatePoints() {
  console.log("function 3 - updatePoints");
  userPointsDiv.innerHTML = "";
  compPointsDiv.innerHTML = "";
  const userPointsTitle = createDomElement("p", "innerHTML", "USER<br>POINTS");
  const userPointsDisplay = createDomElement("p", "textContent", userPoints);

  const compPointsTitle = createDomElement(
    "p",
    "innerHTML",
    "COMPUTER<br>POINTS"
  );
  const compPointsDisplay = createDomElement("p", "textContent", compPoints);

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
          if (hardModeOn === true && strikeCount >= 2) {
            strikeCount = strikeCount + 1;
            document.getElementById("strike3").classList.add("strikeOn");
            compWins(currentWord);
          } else if (hardModeOn === true && strikeCount === 1) {
            strikeCount = 2;
            document.getElementById("strike2").classList.add("strikeOn");
            messageDiv.innerHTML =
              "<p>Word does not exist... one more strike and you lose!</p>";
          } else if (hardModeOn === true && strikeCount === 0) {
            strikeCount = 1;
            document.getElementById("strike1").classList.add("strikeOn");
            messageDiv.innerHTML =
              "<p>Word does not exist... first strike!</p>";
          } else {
            messageDiv.innerHTML = "<p>Word does not exist... try again!</p>";
          }
        } else {
          takeCompTurn();
        }
      }
      // checking functionality ends here
    } else {
      messageDiv.innerHTML = "<p>Please enter a valid letter</p>";
    }
  } else if (e.inputType === "deleteContentBackward") {
    claimButton.style.display = "none";
    continueButton.style.display = "none";
    messageDiv.innerHTML = "";
    getCurrentWord();
    getCurrentOptions();
    updateCounter();
  } else {
    consolelog(e.inputType);
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
  for (const word of wordList) {
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
      letterCounter = letterCounter + 1;
    }
  }
}

function userWins() {
  console.log("function 10 - userWins");
  gameOver = true;
  winner = "user";
  userPoints = userPoints + currentWord.length;
  checkTotalScore(winner);
  if (winnerTotal === "user") {
    messageDiv.innerHTML = "<p>Congratulations, you've won the game!</p>";
    letterboxes = document.querySelectorAll(".letterbox");
    letterboxes.forEach((element) => element.classList.add("userWins")); // add compWins class to each letter
    letterboxes.forEach((element) => element.setAttribute("readonly", ""));
    optionsDiv.innerHTML = "";
    updateScoreboard();
    updatePoints();
    newGameButton.removeAttribute("style");
  } else {
    letterboxes = document.querySelectorAll(".letterbox");
    letterboxes.forEach((element) => element.classList.add("userWins")); // add compWins class to each letter
    letterboxes.forEach((element) => element.setAttribute("readonly", ""));
    messageDiv.innerHTML = "<p>You Win!</p>";
    updatePoints();
    playAgainButton.removeAttribute("style");
    computerGuess = "";
  }
}

function compWins(word) {
  console.log("function 11 - compWins");
  gameOver = true;
  winner = "comp";
  compPoints = compPoints + word.length;
  checkTotalScore(winner);
  if (winnerTotal === "comp") {
    messageDiv.innerHTML = "<p>Aww too bad! You've lost the game :(</p>";
    letterboxes = document.querySelectorAll(".letterbox");
    letterboxes.forEach((element) => element.classList.add("compWins")); // add compWins class to each letter
    letterboxes.forEach((element) => element.setAttribute("readonly", ""));
    optionsDiv.innerHTML = "";
    updateScoreboard();
    updatePoints();
    newGameButton.removeAttribute("style");
  } else {
    letterboxes = document.querySelectorAll(".letterbox");
    letterboxes.forEach((element) => element.classList.add("compWins")); // add compWins class to each letter
    letterboxes.forEach((element) => element.setAttribute("readonly", ""));
    messageDiv.innerHTML = "<p>You Lose!</p>";
    updatePoints();
    playAgainButton.removeAttribute("style");
    computerGuess = "";
  }
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
  playAgainButton.style.display = "none";
  claimButton.style.display = "none";
  continueButton.style.display = "none";
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
  optionsDiv.innerHTML = "";
  getCurrentOptions();
  const hardMode = document.getElementById("hardmode").checked;
  if (hardMode === false) {
    optionsDiv.innerHTML =
      "<p>Possible words left: " + currentOptionsLength + "</p>";
  }
}

function instructions() {
  console.log("function 18 - instructions");
  messageDiv.innerHTML = "";

  const instructionsTitle = createDomElement(
    "h2",
    "textContent",
    "How to Play"
  );
  const firstToXDiv = createDomElement("div", "id", "firstToX");
  const firstToXP = createDomElement(
    "p",
    "innerHTML",
    'First player to <select name="pointsToWin" id="pointsToWin"><option value="20">20</option><option value="50">50</option><option value="100">100</option><option value="200">200</option></select> points, wins!'
  );
  const instructionsList = createDomElement("ol", "textContent", "");
  const instruction1 = createDomElement(
    "li",
    "textContent",
    "Enter the first letter of a word you're trying to build"
  );
  const instruction2 = createDomElement(
    "li",
    "textContent",
    "The computer will then take a turn entering the next letter"
  );
  const instruction3 = createDomElement(
    "li",
    "textContent",
    "Whichever player enters the final letter of the word wins the points"
  );
  const hardModeInstruction = createDomElement(
    "p",
    "innerHTML",
    "<strong>Hard Mode:</strong> with this switched on, you get 3 attempts at a wild guess if you don't know any possible words. After 3 failed attempts, the computer wins the round.<br>Hard Mode also hides the number of possible words left."
  );
  const okButtonP = createDomElement("p", "textContent", "");
  const okButton = createDomElement("button", "textContent", "OK");
  okButton.addEventListener("click", startGame);
  okButtonP.appendChild(okButton);
  instructionsList.appendChild(instruction1);
  instructionsList.appendChild(instruction2);
  instructionsList.appendChild(instruction3);
  firstToXDiv.appendChild(firstToXP);
  messageDiv.appendChild(instructionsTitle);
  messageDiv.appendChild(instructionsList);
  messageDiv.appendChild(firstToXDiv);
  messageDiv.appendChild(hardModeInstruction);
  messageDiv.appendChild(okButtonP);
}

function createDomElement(el, attribute, text) {
  console.log("function 19 - createDomElement");
  const element = document.createElement(el);
  element[attribute] = text;
  return element;
}

function createDifficultySwitch() {
  console.log("function 20 - createDifficultySwitch");
  difficultyDiv.innerHTML = "";
  const switchInput = document.createElement("input");
  switchInput.type = "checkbox";
  switchInput.id = "hardmode";
  if (hardModeOn === true) {
    switchInput.checked = true;
  }
  switchInput.addEventListener("click", toggleHardMode);
  const switchSpan = document.createElement("span");
  switchSpan.classList.add("slider", "round");
  const switchLabel = document.createElement("label");
  switchLabel.classList.add("switch");
  switchLabel.appendChild(switchInput);
  switchLabel.appendChild(switchSpan);
  difficultyDiv.appendChild(switchLabel);
  const difficultyLabel = createDomElement(
    "p",
    "textContent",
    "HARD MODE: OFF"
  );
  difficultyLabel.id = "difficultyLabel";
  difficultyDiv.appendChild(difficultyLabel);
  createThreeStrikes();
}

function toggleHardMode() {
  console.log("function 21 - toggleHardMode");
  const hardMode = document.getElementById("hardmode").checked;
  if (hardMode === true) {
    hardModeOn = true;
    document.getElementById("difficultyLabel").style.fontWeight = 600;
    document.getElementById("difficultyLabel").style.color = "#2C3B69";
    document.getElementById("difficultyLabel").textContent = "HARD MODE: ON";
    updateCounter();
    document.getElementById("threeStrikesP").style.display = "block";
    console.log("Hard Mode ON");
    document.getElementById("letter-" + (letterCounter - 1)).focus();
  } else {
    hardModeOn = false;
    document.getElementById("difficultyLabel").style.fontWeight = 300;
    document.getElementById("difficultyLabel").style.color = "gray";
    document.getElementById("difficultyLabel").textContent = "HARD MODE: OFF";
    updateCounter();
    document.getElementById("threeStrikesP").style.display = "none";
    console.log("Hard Mode OFF");
    document.getElementById("letter-" + (letterCounter - 1)).focus();
  }
}

function createThreeStrikes() {
  console.log("function 22 - threeStrikes");
  const threeStrikesP = createDomElement("p", "textContent", "");
  const strike1 = createDomElement("span", "textContent", "x");
  const strike2 = createDomElement("span", "textContent", "x");
  const strike3 = createDomElement("span", "textContent", "x");
  strike1.id = "strike1";
  strike2.id = "strike2";
  strike3.id = "strike3";
  strike1.classList.add("strike");
  strike2.classList.add("strike");
  strike3.classList.add("strike");
  if (strikeCount > 2) {
    strike1.classList.add("strikeOn");
    strike2.classList.add("strikeOn");
    strike3.classList.add("strikeOn");
  } else if (strikeCount === 2) {
    strike1.classList.add("strikeOn");
    strike2.classList.add("strikeOn");
  } else if (strikeCount === 1) {
    strike1.classList.add("strikeOn");
  }
  threeStrikesP.id = "threeStrikesP";
  if (hardModeOn === false) {
    threeStrikesP.style.display = "none";
  } else {
    threeStrikesP.style.display = "block";
  }
  threeStrikesP.appendChild(strike1);
  threeStrikesP.appendChild(strike2);
  threeStrikesP.appendChild(strike3);
  difficultyDiv.appendChild(threeStrikesP);
}

function updateScoreboard() {
  console.log("function 23 - updateScoreboard");
  const userGamesWon = localStorage.getItem("userGamesWon");
  const compGamesWon = localStorage.getItem("compGamesWon");
  if (userGamesWon !== null) {
    document.getElementById("usersWins").textContent = userGamesWon;
  }
  if (compGamesWon !== null) {
    document.getElementById("compsWins").textContent = compGamesWon;
  }
}

function startGame() {
  console.log("function 24 - startGame");
  numPointsToWin = document.getElementById("pointsToWin").value;
  console.log(numPointsToWin);
  const numPointsToWinStr = "Number of points to win: " + numPointsToWin;
  const pointsToWinP = createDomElement("p", "textContent", numPointsToWinStr);
  document.getElementById("scoreboard").appendChild(pointsToWinP);
  createGameSpace();
}

function checkTotalScore(winner) {
  console.log("function 25 - checkTotalScore");
  if (winner === "user" && userPoints >= numPointsToWin) {
    console.log("winner: " + winner);
    winnerTotal = "user";
    console.log("total winner: " + winnerTotal);
    const userGamesWon = localStorage.getItem("userGamesWon");
    const newUserGamesWon = Number(userGamesWon) + 1;
    console.log("games won: " + newUserGamesWon);
    localStorage.setItem("userGamesWon", newUserGamesWon);
  } else if (winner === "comp" && compPoints >= numPointsToWin) {
    console.log("winner: " + winner);
    winnerTotal = "comp";
    console.log("total winner: " + winnerTotal);
    const compGamesWon = localStorage.getItem("compGamesWon");
    const newCompGamesWon = Number(compGamesWon) + 1;
    console.log("games won: " + newCompGamesWon);
    localStorage.setItem("compGamesWon", newCompGamesWon);
  }
}

function refreshPage() {
  console.log("function 26 - refreshPage");

  location.reload();
}

// STARTING PAGE FUNCTIONS
// setOddsOrEvens(0);
instructions();
updateScoreboard();

document.getElementById("claim").addEventListener("click", claimPoints);
document.getElementById("continue").addEventListener("click", continueGame);
document.getElementById("playAgain").addEventListener("click", resetGameSpace);
document.getElementById("refresh").addEventListener("click", refreshPage);
