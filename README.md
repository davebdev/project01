# Spell Checkers!

Spell Checkers! is a game played against the computer. Loser (or computer, if first go) starts with the first letter, then the computer gets to add a letter, and each player takes turns to add letters until a word is made. Whoever finishes the word gets the points.

## Plan

1. Create basic html set up, with css and js files pointing to main page, along with any basic css styling to make set up readable.
2. Create an array with a small list of words to use for testing
3. Build functionality for user to enter letters and have those letters checked against the array.
4. Letters that are used should then create a new array of suitable words from which the computer can then choose it's next letter
5. Computer logic:
   I had to change the game logic. Originally I coded the computer to find the longest word it could with the current letters, so it was always finding the hardest word dictating the direction of the word really strongly and wouldn't finish the game until that long word was found. I've updated it to select a word at random from the possibilities (as long as the list of current possibilities is more than 1)

## TO DO


- give user number of options left
- Difficulty setting:
    - word lengths higher
    - no hints
    - no additional words after word has been completed
- Get points for shorter word, but steal points if won on longer word
- Instructions appear at beginning

### Bugs to fix

~~- There's a weird thing happening when the computer wins and the user chooses to play again. Because the computer goes first, it's currently using the takeCompTurn() function to place it's first go on the board and I think that's screwing it up. Must investigate further.~~ - FIXED

### Optional TO DO:

- Dictionary meaning
- Make computer 'think' before attempting a go
- Instructions float over page before game

## DONE

- Create points counter
- Play again button
