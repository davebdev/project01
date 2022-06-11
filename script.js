const currentPossibilities = []; // create an array for all possible words based on letters so far
const compWords = []; // create an array for all the longest words the computer has to choose from

let currentWord = "";
let letterboxes = document.querySelectorAll(".letterbox");

const messageDiv = document.getElementById("message");
let letterCounter = 0;

const difficultySetWordList = []; // wordlist of only x length words set in 'setGameDifficulty' function
setGameDifficulty(5);

let gameOver = false; // set state of game

function getCurrentWord() {
  letterboxes = document.querySelectorAll(".letterbox");
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
}

function createNewUserInput() {
  const newUserInput = document.createElement("input");
  newUserInput.type = "text"; // make input type text
  newUserInput.maxLength = 1; // give input max length of 1
  newUserInput.classList.add("letterbox"); // add 'letterbox' class to input
  newUserInput.id = "letter-" + letterCounter; // give input unique id
  newUserInput.value = ""; // give input value of computer's next letter
  newUserInput.readOnly = false; // make input readonly
  newUserInput.addEventListener("keypress", checkGuess);
  letterboxes.forEach((element) => element.removeAttribute("autofocus"));
  document.getElementById("word").appendChild(newUserInput); // append input to div
}

const checkGuess = (e) => {
  if (e.key === "Enter") {
    letterCounter = letterCounter + 1;
    currentPossibilities.length = 0; // empties array
    currentWord = ""; // clear currentWord so fresh check can be made
    messageDiv.innerHTML = "";
    letterboxes = document.querySelectorAll(".letterbox");

    getCurrentWord();
    getCurrentPossibilities();

    if (currentPossibilities.length === 0) {
      console.log("Word does not exist");
      messageDiv.innerHTML = "<p>You Lose!</p>";
    } else {
      takeCompTurn();
      if (gameOver === false) {
        createNewUserInput();
        document.getElementById("letter-" + letterCounter).focus(); // sets the cursor to be in the user guess box already
      }
    }
  }
  console.log("END OF CHECKGUESS FUNCTION");
};

function getCompLongestPossibilities() {
  let lwLength = 0; // set longest word length at 0
  compWords.length = 0; // clear compWords array
  for (const i in currentPossibilities) {
    // cycle through currentPossibilities to find longest word/s
    if (currentPossibilities[i].length > lwLength) {
      lwLength = currentPossibilities[i].length;
    }
  }
  for (const word of currentPossibilities) {
    // for all words that match longest word, push to compWords array
    if (word.length === lwLength) {
      compWords.push(word);
    }
  }
}

function createNewCompInput(letter) {
  const newCompInput = document.createElement("input"); // create new Input tag
  newCompInput.type = "text"; // make input type text
  newCompInput.maxLength = 1; // give input max length of 1
  newCompInput.classList.add("letterbox"); // add 'letterbox' class to input
  newCompInput.id = "letter-" + letterCounter; // give input unique id
  newCompInput.value = letter; // give input value of computer's next letter
  newCompInput.readOnly = true; // make input readonly
  document.getElementById("word").appendChild(newCompInput); // append input to div
  letterCounter = letterCounter + 1;
}

function getCompNextLetter(word, length) {
  let letter = "";
  letter = word.slice(length, length + 1); // get computer's next letter (first letter of computer's guess after current word so far)
  console.log("computer next letter:" + letter);
  return letter;
}

const takeCompTurn = () => {
  const currentWordLength = currentWord.length; // get length of word so far
  getCompLongestPossibilities();
  let computerGuess = ""; // declare computer's guess variable
  const cwLength = compWords.length; // hold compWord array length in a variable
  if (cwLength === 0) {
    // if array length is 0, no more matching words for computer
    messageDiv.innerHTML = "<p>You Win!</p>";
    computerGuess = "No more moves for you, computer!";
    gameOver = true;
  } else if (cwLength === 1 && compWords[0] === currentWord) {
    messageDiv.innerHTML = "<p>You Win!</p>";
    computerGuess = "No more moves for you, computer!";
    gameOver = true;
  } else if (cwLength === 1 && compWords[0] !== currentWord) {
    // if array length is 1, there is only one option for computer
    computerGuess = compWords[0];
    const compNextLetter = getCompNextLetter(computerGuess, currentWordLength);
    createNewCompInput(compNextLetter);
  } else if (cwLength > 1) {
    // if array length is more than one, choose an option at random
    const cwi = Math.floor(Math.random() * cwLength);
    computerGuess = compWords[cwi];
    const compNextLetter = getCompNextLetter(computerGuess, currentWordLength);
    createNewCompInput(compNextLetter);
  } else {
    // error catching
    computerGuess = "Error";
  }
  console.log("computer guess: " + computerGuess);
};

document.getElementById("letter-0").addEventListener("keypress", checkGuess);

function setGameDifficulty(num) {
  for (word of wordList) {
    if (word.length <= num) {
      difficultySetWordList.push(word);
    }
  }
}
