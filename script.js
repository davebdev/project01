const wordList = ["test", "word", "game", "tesseract"];
const gameList = [];

let currentWord = "";

const checkGuess = () => {
  gameList.length = 0; // empties array
  currentWord = currentWord + document.getElementById("letter01").value; // adds 1st value from user entry to currentWord variable
  currentWord = currentWord + document.getElementById("letter02").value; // adds 2nd value from user entry to currentWord variable
  currentWord = currentWord + document.getElementById("letter03").value; // adds 3rd value from user entry to currentWord variable
  currentWord = currentWord.toLowerCase(); // change value to lower case

  const regex = new RegExp("^" + currentWord); // create regex using that value - '^' means any match that starts with
  //   console.log(regex); // testing regex
  for (word of wordList) {
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
  let lwLength = 0;
  let lwIndex = 0;
  const compWords = [];
  for (i in gameList) {
    if (gameList[i].length > lwLength) {
      lwIndex = i;
      lwLength = gameList[i].length;
    }
  }
  console.log("Longest word: " + gameList[lwIndex] + "; Length: " + lwLength);
};

const submitButton = document.getElementById("submit");
submitButton.addEventListener("click", checkGuess);
