const gameList = []; // create an array for all possible words based on letters so far
const compWords = []; // create an array for all the longest words the computer has to choose from

let currentWord = "";

const checkGuess = () => {
  gameList.length = 0; // empties array
  currentWord = ""; // clear currentWord so fresh check can be made

  const letterboxes = document.querySelectorAll(".letterbox");
  letterboxes.forEach((element) => (currentWord = currentWord + element.value)); // get current word by stringing values of all letterboxes together

  currentWord = currentWord.toLowerCase(); // change value to lower case
  console.log("current word:" + currentWord);

  const currentWordLength = currentWord.length; // get length of word so far
  console.log("current word length:" + currentWordLength);

  const regex = new RegExp("^" + currentWord); // create regex using that value - '^' means any match that starts with
  //   console.log(regex); // testing regex
  for (const word of wordList) {
    // for loop running through word list
    if (word.match(regex)) {
      // if regex matches word
      gameList.push(word); // add it to 'gameList' array
    }
  }

  if (gameList.length === 0) {
    console.log("Word does not exist");
  } else {
    takeCompTurn();
    const newUserInput = document.createElement("input");
    newUserInput.type = "text"; // make input type text
    newUserInput.maxLength = 1; // give input max length of 1
    newUserInput.classList.add("letterbox"); // add 'letterbox' class to input
    newUserInput.id = "letter-" + (currentWordLength + 1); // give input unique id
    newUserInput.value = ""; // give input value of computer's next letter
    newUserInput.readOnly = false; // make input readonly
    document.getElementById("word").appendChild(newUserInput); // append input to div
  }
  console.log("Current applicable list of words: ", gameList); // check gameList for correct responses
};

const takeCompTurn = () => {
  const currentWordLength = currentWord.length; // get length of word so far
  console.log("current word length:" + currentWordLength);
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

  const newCompInput = document.createElement("input"); // create new Input tag
  newCompInput.type = "text"; // make input type text
  newCompInput.maxLength = 1; // give input max length of 1
  newCompInput.classList.add("letterbox"); // add 'letterbox' class to input
  newCompInput.id = "letter-" + currentWordLength; // give input unique id
  newCompInput.value = compNextLetter; // give input value of computer's next letter
  newCompInput.readOnly = true; // make input readonly
  document.getElementById("word").appendChild(newCompInput); // append input to div
};

const submitButton = document.getElementById("submit");
submitButton.addEventListener("click", checkGuess);
