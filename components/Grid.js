import { styled } from '@mui/material/styles';
import Cell from './Cell';

const GridStyles = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingBottom: '1rem',
}));

function generateRow(
  rowIndex,
  gameState,
  evaluationGuesses,
  wordLength,
  currRowIndex,
  currGuess
) {
  return (
    <div key={rowIndex} style={{ display: 'flex' }}>
      {Array(wordLength)
        .fill(1)
        .map((el, letterIndex) => (
          <Cell
            key={letterIndex}
            rowIndex={rowIndex}
            letterIndex={letterIndex}
            gameState={gameState}
            evaluationGuesses={evaluationGuesses}
            currRowIndex={currRowIndex}
            currGuess={currGuess}
          />
        ))}
    </div>
  );
}

export default function Grid({
  gameState,
  evaluationGuesses,
  wordLength,
  currRowIndex,
  numOfRows,
  currGuess,
}) {
  return (
    <GridStyles>
      {Array(numOfRows)
        .fill(1)
        .map((el, rowIndex) =>
          generateRow(
            rowIndex,
            gameState,
            evaluationGuesses,
            wordLength,
            currRowIndex,
            currGuess
          )
        )}
    </GridStyles>
  );
}
