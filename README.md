# Stack's On!

Stack's On! is a game played against the computer. Loser (or computer, if first go) starts with the first letter, then the computer gets to add a letter, and each player takes turns to add letters until a word is made. Whoever finishes the word gets the points.

## Plan

1. Create basic html set up, with css and js files pointing to main page, along with any basic css styling to make set up readable.
2. Create an array with a small list of words to use for testing
3. Build functionality for user to enter letters and have those letters checked against the array.
4. Letters that are used should then create a new array of suitable words from which the computer can then choose it's next letter
5. Computer logic:
   - Out of array, pick longest word that matches the beginning that has been entered
   - If there is more than one longest word (more than one word with the same amount of letters more than all the others), pick which one to use at random and put it into variable
   - Remove 'start' of word (however many words have already been spelled out)
   - get first letter of new, chopped word.
   - enter that into new box

## Issues to solve

- What happens when a word is created but there is another possiblity if you keep spelling?
