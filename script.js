const wordList = ["test", "word", "game", "tesseract", "tesserect"];
const gameList = []; // create an array for all possible words based on letters so far
const compWords = []; // create an array for all the longest words the computer has to choose from

let currentWord = "";

const checkGuess = () => {
  gameList.length = 0; // empties array
  console.log("current word:" + currentWord);
  currentWord = currentWord + document.getElementById("letter01").value; // adds 1st value from user entry to currentWord variable
  currentWord = currentWord + document.getElementById("letter02").value; // adds 2nd value from user entry to currentWord variable
  currentWord = currentWord + document.getElementById("letter03").value; // adds 3rd value from user entry to currentWord variable
  currentWord = currentWord.toLowerCase(); // change value to lower case

  const regex = new RegExp("^" + currentWord); // create regex using that value - '^' means any match that starts with
  //   console.log(regex); // testing regex
  for (const word of wordList) {
    // for loop running through word list
    if (word.match(regex)) {
      // if regex matches word
      gameList.push(word); // add it to 'gameList' array
    }
  }
  console.log(gameList); // check gameList for correct responses
  takeCompTurn();
};

const takeCompTurn = () => {
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
  console.log(compWords);
  let computerGuess = ""; // declare computer's guess variable
  const cwLength = compWords.length; // hold compWord array length in a variable
  console.log(cwLength);
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
    computerGuess = "Error here";
  }
  console.log(computerGuess);
};

const submitButton = document.getElementById("submit");
submitButton.addEventListener("click", checkGuess);
