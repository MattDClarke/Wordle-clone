import { useState } from 'react';

// TODO: get from and save to local storage
const boardStateInitial = ['', '', '', '', '', ''];
const evaluationsInitial = [
  ['asasdsdda', '', '', '', '', ''],
  ['', 'asdas', '', '', '', ''],
  ['', '', '', '', '', ''],
  ['', '', '', '', '', ''],
  ['', '', '', '', '', ''],
  ['', '', '', '', '', ''],
];

const rowIndexInitial = 0;
const gameStatusInitial = 'active';

export default function useGameState() {
  const [boardState, setBoardState] = useState(boardStateInitial);
  const [rowIndex, setRowIndex] = useState(rowIndexInitial);
  const [evaluationsState, setEvaluationsState] = useState(evaluationsInitial);
  const [gameStatus, setGameStatus] = useState(gameStatusInitial);

  console.log(evaluationsState);

  return {
    boardState,
    rowIndex,
    setRowIndex,
    evaluationsState,
    gameStatus,
    setGameStatus,

    boardStateUpdate: (guessedWord) => {
      const newBoard = [...boardState];
      newBoard[rowIndex] = guessedWord;
      setBoardState(newBoard);
    },
    evaluationsStateUpdate: (evaluation) => {
      const newEvaluations = [...evaluationsState];
      newEvaluations[rowIndex] = [...evaluation];
      setEvaluationsState(newEvaluations);
    },
  };
}
