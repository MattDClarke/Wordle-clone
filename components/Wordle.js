import { useState, useCallback, useEffect } from 'react';
import { gameStateInitial } from '../lib/initialGameState';
import { useHasMounted } from '../hooks/useHasMounted';
import { useLocalStorage } from '../hooks/useLocalStorage';
import Grid from './Grid';
import Keyboard from './Keyboard';

const wordLength = 5;
const numOfRows = 6;
let currRowIndex = 0;
let gameStatus = '';
const evaluationLetters = {};
let evaluationGuesses = [];
let wordList = [];
let showSolution = '';

export function Wordle() {
  const hasMounted = useHasMounted();
  const [gameState, setGameState] = useLocalStorage(
    'gameState',
    gameStateInitial
  );
  const [currGuess, setCurrGuess] = useState('');
  const [msg, setMsg] = useState('');

  // console.log(
  //   { gameState },
  //   { evaluationLetters },
  //   { currRowIndex },
  //   { gameStatus },
  //   { currRowIndex },
  //   { evaluationGuesses }
  // );

  if (hasMounted) {
    currRowIndex = gameState.boardState.filter((guess) => guess !== '').length;
    if (gameStatus === 'lose') {
      showSolution = `The solution is: ${gameState.solution}`;
    }
  }

  const determineEvaluationsAndCurrRowIndex = useCallback(
    (boardState) => {
      const solution = [...gameState.solution];
      // determine state of each letter for keyboard: 'absent, 'wrongPlace' or 'correct'
      const prevGuesses = boardState.filter((guess) => guess !== '');
      currRowIndex = prevGuesses.length;

      evaluationGuesses = prevGuesses.map((guess) =>
        [...guess].map((letter, i) => {
          if (solution.includes(letter)) {
            if (letter === solution[i]) {
              return 'correct';
            }
            return 'wrongPlace';
          }
          return 'absent';
        })
      );
      //  for each prevGuess
      //      make guess (string) an array using spread operator
      //         map through - for each letter - compare to solution to determine 'worngPlace', 'correct' or 'absent
      //           use the array of arrays for coloring Cells
      const boardLetters = prevGuesses
        .map((str) => [...str.toLowerCase()])
        .flat();

      // object showing state of each letter used in guesses
      // map letters to their evaluations
      let evaluation;
      boardLetters.forEach((letter, i) => {
        // get correct index
        const index = i % wordLength;
        if (solution.includes(letter)) {
          if (letter !== solution[index]) {
            // prevent 'wrongPlace' overwriting 'correct'
            //    'correct' should overwrite 'wrongPlace'
            if (evaluationLetters[letter] === 'correct') {
              return;
            }
            evaluation = 'wrongPlace';
            // correct position
          } else {
            evaluation = 'correct';
          }
        } else {
          evaluation = 'absent';
        }
        evaluationLetters[letter] = evaluation;
      });
    },
    [gameState?.solution]
  );

  const determineGameStatus = useCallback(
    (boardState) => {
      // eslint-disable-next-line
      const solution = gameState.solution;
      if (boardState.includes(solution) && solution !== '') {
        gameStatus = 'win';
      } else if (currRowIndex >= 6) {
        gameStatus = 'lose';
      } else {
        gameStatus = 'active';
      }
    },
    [gameState?.solution]
  );

  function gameStatusMsg() {
    if (gameStatus === '' || gameStatus === 'active') return '';
    if (gameStatus === 'lose' || gameStatus === 'active') return 'You lose';
    if (gameStatus === 'win' || gameStatus === 'active') return 'You win';
  }

  function handleKey(key) {
    const { boardState, solution } = gameState;
    if (boardState.length === 6) {
      return;
    }
    const letter = key.toLowerCase();
    if (letter === 'enter') {
      if (currGuess.length < 5) {
        setMsg('Not enough letters');
        return;
      }
      if (!wordList.includes(currGuess)) {
        setMsg('Not in word list');
        return;
      }
      if (boardState.length === 5 && currGuess !== solution) {
        setMsg(`The solution is: ${solution}`);
      }
      const newBoardState = [...boardState, currGuess];
      setGameState((prevState) => {
        const newGameState = {
          ...prevState,
          boardState: newBoardState,
        };
        return newGameState;
      });
      setCurrGuess('');
    } else if (letter === 'backspace') {
      setCurrGuess(currGuess.slice(0, currGuess.length - 1));
    } else if (/^[a-z]$/.test(letter)) {
      if (currGuess.length < 5) {
        setCurrGuess(currGuess + letter);
      }
    }
  }

  function handleKeyDown(e) {
    if (e.ctrlKey || e.metaKey || e.altKey || gameStatus !== 'active') {
      return;
    }
    handleKey(e.key);
  }

  useEffect(() => {
    // TODO - request word of the day from server AND list of allowed words
    //   check date in local storage
    //     compare to today
    //       if today is a new day -> make request for new word
    //          else use state from local storage
    const randomWord = 'water';
    const wordListFromServer = [
      'water',
      'crazy',
      'human',
      'hands',
      'drink',
      'power',
      'great',
      'women',
    ];
    wordList = wordListFromServer;
    setGameState((prevState) => {
      const newGameState = {
        ...prevState,
        solution: randomWord,
      };
      return newGameState;
    });
  }, [setGameState]);

  useEffect(() => {
    determineEvaluationsAndCurrRowIndex(gameState.boardState);
    determineGameStatus(gameState.boardState);
  }, [determineEvaluationsAndCurrRowIndex, determineGameStatus, gameState]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div>
      <div>{gameStatusMsg()}</div>
      <div>{msg}</div>
      <div>{showSolution !== '' && showSolution}</div>
      {/* if component not mounted (server render) - display initial game state.  */}
      {/* to make sure server render matches client render - only pass gameState to grid onMount */}
      {/* gameStateInitial acts as placeholder of empty values in grid */}
      <Grid
        gameState={hasMounted ? gameState : gameStateInitial}
        evaluationGuesses={evaluationGuesses}
        wordLength={wordLength}
        numOfRows={numOfRows}
        currRowIndex={currRowIndex}
        currGuess={currGuess}
      />
      <Keyboard
        evaluationLetters={evaluationLetters}
        handleKey={handleKey}
        gameStatus={gameStatus}
      />
    </div>
  );
}
