import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';
import useGameState from '../hooks/useGameState';
import useKeyPress from '../hooks/useKeyPress';
import Keyboard from '../lib/Keyboard';

const WORD_LEN = 5;
const ROWS_NUM = 6;

export default function WordleGrid({ solution }) {
  const [errorMsg, setErrorMsg] = useState('');
  console.log('Wordle Grid render');
  const {
    boardState,
    rowIndex,
    setRowIndex,
    evaluationsState,
    gameStatus,
    setGameStatus,
    currWordState,
    setCurrWordState,
    boardStateUpdate,
    evaluationsStateUpdate,
    currWordStateUpdate,
    deleteLastCurrWordStateLetter,
    currWordStateUpdateClick,
  } = useGameState(solution);

  const [enterPress, setEnterPress] = useKeyPress('Enter');
  const [backspacePress] = useKeyPress('Backspace');

  useEffect(() => {
    if (gameStatus === 'active' && enterPress === true && rowIndex < ROWS_NUM) {
      // make sure all letters filled in for current row
      const numberOfLetters = currWordState.filter(
        (letter) => letter !== ''
      ).length;
      if (numberOfLetters < 5) {
        if (numberOfLetters > 0) {
          setErrorMsg('not enough letters');
        }
      } else {
        const guessedWord = currWordState.join('');
        if (boardState.includes(guessedWord) && boardState[rowIndex] === '') {
          setErrorMsg('cant use same word twice');
          return;
        }

        evaluationsStateUpdate(guessedWord);
        boardStateUpdate(guessedWord);
        setCurrWordState(['', '', '', '', '']);
        if (guessedWord === solution) {
          setGameStatus('win');
        }
      }
    }
  }, [
    enterPress,
    gameStatus,
    setGameStatus,
    solution,
    currWordState,
    boardStateUpdate,
    boardState,
    rowIndex,
    evaluationsStateUpdate,
    setCurrWordState,
  ]);

  useEffect(() => {
    if (
      boardState[rowIndex] !== '' &&
      rowIndex < ROWS_NUM &&
      boardState[rowIndex] !== solution
    ) {
      setRowIndex((prevState) => prevState + 1);
    }
  }, [
    boardState,
    rowIndex,
    setRowIndex,
    setGameStatus,
    solution,
    currWordState,
  ]);

  useEffect(() => {
    if (rowIndex !== 0 && gameStatus === 'active') {
      if (rowIndex === ROWS_NUM) {
        setGameStatus('lose');
      }
    }
  }, [setCurrWordState, rowIndex, gameStatus, setGameStatus]);

  useEffect(() => {
    if (
      gameStatus === 'active' &&
      backspacePress === true &&
      rowIndex < ROWS_NUM
    ) {
      deleteLastCurrWordStateLetter();
    }
  }, [gameStatus, backspacePress, rowIndex, deleteLastCurrWordStateLetter]);

  useEffect(() => {
    if (errorMsg === '') return;
    // reset msg state after certain time
    const timer = setTimeout(() => {
      setErrorMsg('');
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [errorMsg]);

  function determineColor(evaluation) {
    if (evaluation === 'absent') return 'color-absent-light';
    if (evaluation === 'wrongPlace') return 'color-wrong-place-light';
    if (evaluation === 'correct') return 'color-correct-light';
  }

  function generateRow(currRowIndex) {
    if (currRowIndex === rowIndex && gameStatus === 'active') {
      const currLetterIndex = currWordState.filter((letter) => !!letter).length;
      return (
        <div key={currRowIndex}>
          {' '}
          {Array(WORD_LEN)
            .fill(1)
            .map((el, indx) => {
              if (indx === currLetterIndex) {
                return (
                  <TextField
                    key={indx}
                    value={currWordState[indx]}
                    onChange={currWordStateUpdate}
                    variant="outlined"
                    data-index={indx}
                    autoFocus
                    inputProps={{
                      maxLength: 1,
                      pattern: '[A-Za-z]',
                      dataindex: indx,
                    }}
                    sx={{
                      width: '50px',
                      height: '50px',
                    }}
                  />
                );
              }
              return (
                <div
                  key={indx}
                  data-index={indx}
                  style={{
                    display: 'inline-block',
                    flex: 1,
                    width: '50px',
                    height: '50px',
                    border: '1px solid black',
                    backgroundColor: 'var(--color-background-light)',
                  }}
                >
                  {currWordState[indx]}
                </div>
              );
            })}
        </div>
      );
    }
    return (
      <div key={currRowIndex} style={{ display: 'flex' }}>
        {Array(WORD_LEN)
          .fill(1)
          .map((el, indx) => (
            <div
              key={indx}
              data-index={indx}
              style={{
                display: 'inline-block',
                flex: 1,
                width: '50px',
                height: '50px',
                border: '1px solid black',
                backgroundColor:
                  currRowIndex <= rowIndex
                    ? `var(--${determineColor(
                        evaluationsState[currRowIndex][indx]
                      )})`
                    : 'var(--color-background-light)',
              }}
            >
              {boardState[currRowIndex][indx]}
            </div>
          ))}
      </div>
    );
  }

  function generateRows() {
    const rows = [];
    for (let currRowIndex = 0; currRowIndex < ROWS_NUM; currRowIndex += 1) {
      rows.push(generateRow(currRowIndex));
    }
    return <div>{rows}</div>;
  }

  return (
    <>
      <div>{errorMsg}</div>
      <div>{gameStatus === 'win' && 'You win!'}</div>
      <div>{gameStatus === 'lose' && 'You lose'}</div>
      {generateRows()}
      <Keyboard
        setEnterPress={setEnterPress}
        boardState={boardState}
        rowIndex={rowIndex}
        evaluationsState={evaluationsState}
        currWordState={currWordState}
        deleteLastCurrWordStateLetter={deleteLastCurrWordStateLetter}
        currWordStateUpdateClick={currWordStateUpdateClick}
      />
    </>
  );
}
