# Spellcheckers

Spellcheckers is an online word game built primarily with javascript, and it is a game played against the computer. Loser (or computer, if first go) starts with the first letter, then the computer gets to add a letter, and each player takes turns to add letters until a word is made. Whoever finishes the word gets the points.

## HARD MODE

There is a switch in the top left corner which turns on Hard Mode. In Hard Mode, the user gets three opportunities to enter a letter that, based on possibilities of all current letters so far, is not leading to a valid word. Once those three strikes are counted, the computer wins. This count will persist until the end of the game, so if the user makes a mistake again, the computer instantly wins.

## Plan

1. Create basic html set up, with css and js files pointing to main page, along with any basic css styling to make set up readable.
2. Create an array with a small list of words to use for testing
3. Build functionality for user to enter letters and have those letters checked against the array.
4. Letters that are used should then create a new array of suitable words from which the computer can then choose it's next letter
5. Computer logic:
   I had to change the game logic. Origin ally I coded the computer to find the longest word it could with the current letters, so it was always finding the hardest word dictating the direction of the word really strongly and wouldn't finish the game until that long word was found. I've updated it to select a word at random from the possibilities (as long as the list of current possibilities is more than 1)

## TO DO
NONE!


### Bugs to fix

~~- There's a weird thing happening when the computer wins and the user chooses to play again. Because the computer goes first, it's currently using the takeCompTurn() function to place it's first go on the board and I think that's screwing it up. Must investigate further.~~ - FIXED

### Optional TO DO:

- Dictionary meaning [https://dictionaryapi.dev/](https://dictionaryapi.dev/)
- Make computer 'think' before attempting a go
- Instructions float over page before game
- Row shakes when
- Double the points for longer words (tbd length)

## DONE

- Create points counter
- Play again button
- give user number of options left
- Get points for shorter word, ~~but steal points if won on longer word~~
- Instructions appear at beginning
- Difficulty setting:
    - three strikes system for letter guessing
    - no hints
- First to 'x' number of points wins
