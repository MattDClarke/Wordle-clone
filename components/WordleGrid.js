import TextField from '@mui/material/TextField';
import { useEffect } from 'react';
import useGameState from '../hooks/useGameState';
import useKeyPress from '../hooks/useKeyPress';
import Keyboard from '../lib/Keyboard';

const WORD_LEN = 5;
const ROWS_NUM = 6;

let errorMsg = '';

export default function WordleGrid({ solution }) {
  console.log('render');
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
  } = useGameState(solution);

  const enterPress = useKeyPress('Enter');

  useEffect(() => {
    errorMsg = '';
    if (gameStatus === 'active' && enterPress === true) {
      // make sure all letters filled in for current row
      const numberOfLetters = currWordState.length;
      if (numberOfLetters < 5) {
        if (numberOfLetters > 0) {
          errorMsg = 'not enough letters';
        }
      } else {
        if (boardState.includes(currWordState)) {
          errorMsg = 'cant use same word twice';
          return;
        }
        evaluationsStateUpdate(currWordState);
        boardStateUpdate(currWordState);
        if (currWordState === solution) {
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
  ]);

  useEffect(() => {
    if (
      boardState[rowIndex] !== '' &&
      rowIndex < ROWS_NUM &&
      // dont change row index if word guessed correctly
      currWordState !== solution
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
      } else {
        setCurrWordState('');
      }
    }
  }, [setCurrWordState, rowIndex, gameStatus, setGameStatus]);

  function determineColor(evaluation) {
    if (evaluation === 'absent') return 'color-absent-light';
    if (evaluation === 'wrongPlace') return 'color-wrong-place-light';
    if (evaluation === 'correct') return 'color-correct-light';
  }

  function generateRow(currRowIndex) {
    if (currRowIndex === rowIndex && gameStatus === 'active') {
      return (
        <div key={currRowIndex}>
          {' '}
          {Array(WORD_LEN)
            .fill(1)
            .map((el, indx) => (
              <TextField
                key={indx}
                // if undefined (currWordState is a string - length may be less than indx) - set to ''
                value={currWordState[indx] ?? ''}
                onChange={currWordStateUpdate}
                variant="outlined"
                data-index={indx}
                autoFocus={indx === 0}
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
            ))}
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
        boardState={boardState}
        evaluationsState={evaluationsState}
        gameStatus={gameStatus}
        rowIndex={rowIndex}
      />
    </>
  );
}
