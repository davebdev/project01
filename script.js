const gameList = []; // create an array for all possible words based on letters so far
const compWords = []; // create an array for all the longest words the computer has to choose from

let currentWord = "";

const checkGuess = () => {
  gameList.length = 0; // empties array
  console.log("current word:" + currentWord);

  const letterboxes = document.querySelectorAll(".letterbox");
  letterboxes.forEach((element) => (currentWord = currentWord + element.value)); // get current word by stringing values of all letterboxes together

  currentWord = currentWord.toLowerCase(); // change value to lower case
  console.log("current word:" + currentWord);

  const regex = new RegExp("^" + currentWord); // create regex using that value - '^' means any match that starts with
  //   console.log(regex); // testing regex
  for (const word of wordList) {
    // for loop running through word list
    if (word.match(regex)) {
      // if regex matches word
      gameList.push(word); // add it to 'gameList' array
    }
  }
  console.log("Current applicable list of words: ", gameList); // check gameList for correct responses
  takeCompTurn();
};

const takeCompTurn = () => {
  const currentWordLength = currentWord.length; // get length of word so far
  let lwLength = 0; // set longest word length at 0
  let lwIndex = 0; // set longest word index at 0
  compWords.length = 0; // clear compWords array
  for (const i in gameList) {
    // cycle through gameList to find longest word/s
    if (gameList[i].length > lwLength) {
      lwIndex = i;
      lwLength = gameList[i].length;
    }
  }
  console.log("Longest word: " + gameList[lwIndex] + "; Length: " + lwLength);
  for (const word of gameList) {
    // for all words that match longest word, push to compWords array
    if (word.length === lwLength) {
      compWords.push(word);
    }
  }
  console.log("computer's list of words: ", compWords);
  let computerGuess = ""; // declare computer's guess variable
  const cwLength = compWords.length; // hold compWord array length in a variable
  console.log("computer's word's length: " + cwLength);
  if (cwLength === 0) {
    // if array length is 0, no more matching words for computer
    computerGuess = "No more moves for you, computer!";
  } else if (cwLength === 1) {
    // if array length is 1, there is only one option for computer
    computerGuess = compWords[0];
  } else if (cwLength > 1) {
    // if array length is more than one, choose an option at random
    const cwi = Math.floor(Math.random() * cwLength);
    computerGuess = compWords[cwi];
  } else {
    // error catching
    computerGuess = "Error";
  }
  console.log("computer guess: " + computerGuess);

  let compNextLetter = "";
  compNextLetter = computerGuess.slice(
    currentWordLength,
    currentWordLength + 1
  ); // get computer's next letter (first letter of computer's guess after current word so far)
  console.log("computer next letter:" + compNextLetter);

  const newInput = document.createElement("input"); // create new Input tag
  newInput.type = "text"; // make input type text
  newInput.maxLength = 1; // give input max length of 1
  newInput.classList.add("letterbox"); // add 'letterbox' class to input
  newInput.id = "letter-" + currentWordLength; // give input unique id
  newInput.value = compNextLetter; // give input value of computer's next letter
  newInput.readOnly = true; // make input readonly
  document.getElementById("word").appendChild(newInput); // append input to div
};

const submitButton = document.getElementById("submit");
submitButton.addEventListener("click", checkGuess);
