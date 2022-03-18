import { useState, useCallback, useEffect, useContext } from 'react';
import { gameStateInitial } from '../lib/initialGameAndStatisticsState';
import { useHasMounted } from '../hooks/useHasMounted';
import Grid from './Grid';
import Keyboard from './Keyboard';
import MsgSnackbar from './MsgSnackbar';
import { wordList } from '../lib/wordList';
import { HardModeContext } from '../contexts/HardMode.context';

const wordLength = 5;
const numOfRows = 6;
let currRowIndex = 0;
let gameStatus = '';
const evaluationLetters = {};
let evaluationGuesses = [];

export function Wordle({
  gameState,
  setGameState,
  infoMsg,
  setInfoMsg,
  countInfoMsgs,
  setCountInfoMsgs,
  setStatisticsState,
  setOpenStatistics,
}) {
  const { hardMode } = useContext(HardModeContext);
  const hasMounted = useHasMounted();
  const [currGuess, setCurrGuess] = useState('');
  const [loseMsg, setLoseMsg] = useState('');
  const [winMsg, setWinMsg] = useState('');
  // fetching number of the day
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);

  function toggleSetInfoMsg(msg) {
    setInfoMsg(msg);
    setTimeout(() => setInfoMsg(''), 1000);
  }

  function getHardModeMsg(index, letter) {
    switch (index) {
      case 0:
        toggleSetInfoMsg(`First letter must be ${letter}`);
        break;
      case 1:
        toggleSetInfoMsg(`Second letter must be ${letter}`);
        break;
      case 2:
        toggleSetInfoMsg(`Third letter must be ${letter}`);
        break;
      case 3:
        toggleSetInfoMsg(`Fourth letter must be ${letter}`);
        break;
      default:
        toggleSetInfoMsg(`Fifth letter must be ${letter}`);
    }
  }

  // input - arrays
  function determineGuessEvaluation(guess, solution) {
    return guess.map((letter, i) => {
      if (solution.includes(letter)) {
        if (letter === solution[i]) {
          return 'correct';
        }
        return 'wrongPlace';
      }
      return 'absent';
    });
  }

  const determineEvaluationsAndCurrRowIndex = useCallback(
    (boardState) => {
      const solution = [...gameState.solution];
      // determine state of each letter for keyboard: 'absent, 'wrongPlace' or 'correct'
      const prevGuesses = boardState.filter((guess) => guess !== '');

      evaluationGuesses = prevGuesses.map((guess) =>
        determineGuessEvaluation([...guess], solution)
      );
      //  for each prevGuess
      //      make guess (string) an array using spread operator
      //         map through - for each letter - compare to solution to determine 'wrongPlace', 'correct' or 'absent
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

  function calcAvgGuesses(guesses, gamesPlayed, currNumGuesses) {
    const totalNumGuesses = Object.values(guesses)
      .slice(0, -1)
      .reduce((total, num, i) => total + num * (i + 1), 0);
    return Math.floor((totalNumGuesses + currNumGuesses) / gamesPlayed);
  }

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
        setCountInfoMsgs(countInfoMsgs + 1);
        return;
      }

      if (!wordList.includes(currGuess.toLowerCase())) {
        toggleSetInfoMsg('Not in word list');
        setCountInfoMsgs(countInfoMsgs + 1);
        return;
      }

      // Hardmode check
      if (hardMode === 'true' && boardState.length > 0) {
        const lastGuessEvaluation =
          evaluationGuesses[evaluationGuesses.length - 1];
        const currGuessArr = [...currGuess];
        const currGuessEvaluation = determineGuessEvaluation(currGuessArr, [
          ...solution,
        ]);

        const lastGuessArr = boardState[boardState.length - 1];
        for (const [i, evaluation] of lastGuessEvaluation.entries()) {
          if (
            evaluation === 'correct' &&
            currGuessEvaluation[i] !== 'correct'
          ) {
            getHardModeMsg(i, solution[i]);
            setCountInfoMsgs(countInfoMsgs + 1);
            return;
          }
          if (
            evaluation === 'wrongPlace' &&
            !currGuessArr.includes(lastGuessArr[i])
          ) {
            toggleSetInfoMsg(`Guess must contain ${lastGuessArr[i]}`);
            setCountInfoMsgs(countInfoMsgs + 1);
            return;
          }
        }
      }

      const newBoardState = [...boardState, currGuess];
      // update lastPlayedTs timestamp after first guess
      if (boardState.length === 0) {
        setGameState((prevState) => {
          const newGameState = {
            ...prevState,
            boardState: newBoardState,
            lastPlayedTs: Date.now(),
          };
          return newGameState;
        });
      } else {
        setGameState((prevState) => {
          const newGameState = {
            ...prevState,
            boardState: newBoardState,
          };
          return newGameState;
        });
      }

      if (boardStateLen === 5 && currGuess !== solution) {
        setGameState((prevState) => {
          const newGameState = {
            ...prevState,
            lastCompletedTs: Date.now(),
          };
          return newGameState;
        });
        // update Stats
        setStatisticsState((prevState) => {
          let { guesses, gamesPlayed } = prevState;
          let { fail } = guesses;

          const newGameState = {
            ...prevState,
            gamesPlayed: (gamesPlayed += 1),
            guesses: {
              ...prevState.guesses,
              fail: (fail += 1),
            },
          };
          return newGameState;
        });
        setLoseMsg(`The solution is: ${solution}`);
      }

      if (currGuess === solution) {
        setGameState((prevState) => {
          const newGameState = {
            ...prevState,
            lastCompletedTs: Date.now(),
          };
          return newGameState;
        });
        // update Stats
        setStatisticsState((prevState) => {
          let { gamesWon, gamesPlayed, guesses } = prevState;
          const numGuesses = (boardStateLen + 1).toString();
          let prevGuessNum = prevState.guesses[boardStateLen + 1];

          const newGameState = {
            ...prevState,
            // add 1 for curr game (not added yet... using prev state) and add curr num of guesses to get solution
            averageGuesses: calcAvgGuesses(
              guesses,
              gamesPlayed + 1,
              boardStateLen + 1
            ),
            gamesWon: (gamesWon += 1),
            gamesPlayed: (gamesPlayed += 1),
            guesses: {
              ...prevState.guesses,
              [numGuesses]: (prevGuessNum += 1),
            },
          };
          return newGameState;
        });

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

  // set solution of the day
  useEffect(() => {
    // TODO - request word of the day from server
    //   check date in local storage
    //     compare to today
    //       if today is a new day -> make request for new word
    //          else use state from local storage

    const currentDate = new Date().toLocaleDateString('en-GB');
    // === undefined if lastSolutionFetchDate is null (initial state - first time website opened -> need to fetch solution)
    const lastFetchDate = gameState.lastSolutionFetchDate;

    console.log({ currentDate }, { lastFetchDate });

    if (currentDate !== lastFetchDate) {
      // API call
      // get random number for day
      setLoading(true);
      fetch(`api/random-num?date=${currentDate}`)
        .then((res) => res.json())
        .then((dta) => {
          console.log(dta.randomNum);

          setData(dta.randomNum);
          // use number to get word of the day from wordList
          // set in local storage
          setGameState((prevState) => {
            const newGameState = {
              ...prevState,
              lastSolutionFetchDate: currentDate,
              solution: wordList[dta.randomNum].toUpperCase(),
            };
            return newGameState;
          });
          setLoading(false);
        });
    }
  }, [setGameState, gameState.lastSolutionFetchDate]);

  useEffect(() => {
    setCurrGuess('');
    determineEvaluationsAndCurrRowIndex(gameState.boardState);
    determineGameStatus(gameState.boardState);
    if (gameStatus === 'win' || gameStatus === 'lose') {
      setTimeout(() => {
        setOpenStatistics(true);
      }, 2000);
    }
  }, [
    determineEvaluationsAndCurrRowIndex,
    determineGameStatus,
    gameState,
    setOpenStatistics,
  ]);

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
        infoMsg={infoMsg}
        isLoading={isLoading}
      />
      <Keyboard
        evaluationLetters={evaluationLetters}
        handleKey={handleKey}
        gameStatus={hasMounted ? gameStatus : 'active'}
      />
    </>
  );
}
