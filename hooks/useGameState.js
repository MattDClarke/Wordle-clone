import { useState } from 'react';

// TODO: get from and save to local storage
const boardStateInitial = ['', '', '', '', '', ''];
const evaluationsInitial = [
  ['', '', '', '', '', ''],
  ['', '', '', '', '', ''],
  ['', '', '', '', '', ''],
  ['', '', '', '', '', ''],
  ['', '', '', '', '', ''],
  ['', '', '', '', '', ''],
];

const rowIndexInitial = 0;
const gameStatusInitial = 'active';
const currWordInitial = '';

export default function useGameState(solution) {
  const [boardState, setBoardState] = useState(boardStateInitial);
  const [rowIndex, setRowIndex] = useState(rowIndexInitial);
  const [evaluationsState, setEvaluationsState] = useState(evaluationsInitial);
  const [gameStatus, setGameStatus] = useState(gameStatusInitial);
  const [currWordState, setCurrWordState] = useState(currWordInitial);

  return {
    boardState,
    rowIndex,
    setRowIndex,
    evaluationsState,
    gameStatus,
    setGameStatus,
    currWordState,
    setCurrWordState,

    boardStateUpdate: (guessedWord) => {
      const newBoardState = [...boardState];
      newBoardState[rowIndex] = guessedWord;
      setBoardState(newBoardState);
    },
    evaluationsStateUpdate: (evaluation) => {
      const newEvaluations = [...evaluationsState];
      newEvaluations[rowIndex] = [...evaluation].map((item, i) => {
        let letter = item;
        if ([...solution].includes(letter)) {
          if (letter !== solution[i]) {
            letter = 'wrongPlace';
          } else {
            letter = 'correct';
          }
        } else {
          letter = 'absent';
        }
        return letter;
      });
      setEvaluationsState(newEvaluations);
    },
    currWordStateUpdate: (e) => {
      const letter = e.target.value;
      const index = parseInt(e.target.getAttribute('dataindex'));
      const newCurrWordState = [...currWordState];
      newCurrWordState[index] = letter;
      setCurrWordState(newCurrWordState.join(''));
    },
  };
}