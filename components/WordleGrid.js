import TextField from '@mui/material/TextField';
import { useEffect } from 'react';
import useGameState from '../hooks/useGameState';
import useKeyPress from '../hooks/useKeyPress';

const WORD_LEN = 5;
const ROWS_NUM = 6;

let errorMsg = '';

export default function WordleGrid({ solution }) {
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
  } = useGameState();

  const enterPress = useKeyPress('Enter');

  useEffect(() => {
    errorMsg = '';
    if (gameStatus === 'active' && enterPress === true) {
      // make sure all letters filled in for current row
      const numberOfLetters = currWordState.filter(
        (letter) => letter !== ''
      ).length;
      if (numberOfLetters < 5) {
        if (numberOfLetters > 0) {
          errorMsg = 'not enough letters';
        }
      } else {
        const guessedWord = currWordState.join('');
        if (boardState.includes(guessedWord)) {
          errorMsg = 'cant use same word twice';
          return;
        }
        boardStateUpdate(guessedWord);
      }
    }
  }, [
    enterPress,
    gameStatus,
    currWordState,
    boardStateUpdate,
    boardState,
    rowIndex,
  ]);

  useEffect(() => {
    if (boardState[rowIndex] !== '' && rowIndex < ROWS_NUM) {
      setRowIndex((prevState) => prevState + 1);
    }
  }, [boardState, rowIndex, setRowIndex]);

  useEffect(() => {
    if (rowIndex !== 0) {
      setCurrWordState(['', '', '', '', '']);
    }
  }, [setCurrWordState, rowIndex]);

  function generateRow(currRowIndex) {
    if (currRowIndex === rowIndex) {
      return (
        <div key={currRowIndex}>
          {' '}
          {Array(WORD_LEN)
            .fill(1)
            .map((el, indx) => (
              <TextField
                key={indx}
                value={currWordState[indx]}
                onChange={currWordStateUpdate}
                variant="outlined"
                data-index={indx}
                autoFocus={indx === 0}
                inputProps={{
                  maxLength: 1,
                  pattern: '[A-Za-z]',
                  dataindex: indx,
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
                backgroundColor: 'red',
                flex: 1,
                width: '20px',
                height: '20px',
                border: '1px solid black',
              }}
            >
              {evaluationsState[currRowIndex][indx]}
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
      {generateRows()}
    </>
  );
}
