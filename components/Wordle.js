import { useState, useCallback, useEffect } from 'react';
import { gameStateInitial } from '../lib/initialGameState';
import { useHasMounted } from '../hooks/useHasMounted';
import { useLocalStorage } from '../hooks/useLocalStorage';
import Grid from './Grid';
import Keyboard from './Keyboard';
import MsgSnackbar from './MsgSnackbar';
import { wordList } from '../lib/wordList';

const wordLength = 5;
const numOfRows = 6;
let currRowIndex = 0;
let gameStatus = '';
const evaluationLetters = {};
let evaluationGuesses = [];

export function Wordle() {
  const hasMounted = useHasMounted();
  const [gameState, setGameState] = useLocalStorage(
    'gameState',
    gameStateInitial
  );
  const [currGuess, setCurrGuess] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [loseMsg, setLoseMsg] = useState('');
  const [winMsg, setWinMsg] = useState('');
  const [countInfoMsgs, setCountMsgs] = useState(0);

  const determineEvaluationsAndCurrRowIndex = useCallback(
    (boardState) => {
      // setCurrGuess('');

      const solution = [...gameState.solution];
      // determine state of each letter for keyboard: 'absent, 'wrongPlace' or 'correct'
      const prevGuesses = boardState.filter((guess) => guess !== '');

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
        .map((str) => [...str.toUpperCase()])
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
      currRowIndex = prevGuesses.length;
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

  function handleKey(key) {
    const { boardState, solution } = gameState;
    const boardStateLen = boardState.length;
    if (boardStateLen === 6) {
      return;
    }
    const letter = key.toUpperCase();
    if (letter === 'ENTER') {
      if (currGuess.length < 5) {
        setInfoMsg('Not enough letters');
        setCountMsgs(countInfoMsgs + 1);
        return;
      }
      if (!wordList.includes(currGuess.toLowerCase())) {
        setInfoMsg('Not in word list');
        setCountMsgs(countInfoMsgs + 1);
        return;
      }
      const newBoardState = [...boardState, currGuess];
      setGameState((prevState) => {
        const newGameState = {
          ...prevState,
          boardState: newBoardState,
        };
        return newGameState;
      });

      if (boardStateLen === 5 && currGuess !== solution) {
        setLoseMsg(`The solution is: ${solution}`);
      }
      if (currGuess === solution) {
        switch (boardStateLen) {
          case 0:
            setWinMsg('Well done!');
            break;
          case 1:
            setWinMsg('Excellent!');
            break;
          case 2:
            setWinMsg('Splendid!');
            break;
          case 3:
            setWinMsg('Great!');
            break;
          case 4:
            setWinMsg('Very good!');
            break;
          default:
            setWinMsg('Good!');
        }
      }
    } else if (letter === 'BACKSPACE') {
      setCurrGuess(currGuess.slice(0, currGuess.length - 1));
    } else if (/^[A-Z]$/.test(letter)) {
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
    // TODO - request word of the day from server
    //   check date in local storage
    //     compare to today
    //       if today is a new day -> make request for new word
    //          else use state from local storage
    const randomWord = 'water';

    setGameState((prevState) => {
      const newGameState = {
        ...prevState,
        solution: randomWord.toUpperCase(),
      };
      return newGameState;
    });
  }, [setGameState]);

  useEffect(() => {
    setCurrGuess('');
    determineEvaluationsAndCurrRowIndex(gameState.boardState);
    determineGameStatus(gameState.boardState);
  }, [determineEvaluationsAndCurrRowIndex, determineGameStatus, gameState]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <>
      <MsgSnackbar
        msgType="info"
        msg={infoMsg}
        autoHideDuration={2000}
        countMsgs={countInfoMsgs}
      />
      <MsgSnackbar
        msgType="error"
        msg={loseMsg}
        autoHideDuration={10000}
        countMsgs={1}
      />
      <MsgSnackbar
        msgType="success"
        msg={winMsg}
        autoHideDuration={5000}
        countMsgs={1}
      />
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
        gameStatus={hasMounted ? gameStatus : 'active'}
      />
    </>
  );
}
