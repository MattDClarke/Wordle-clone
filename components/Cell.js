import { Box } from '@mui/material';

function determineColor(evaluation) {
  if (evaluation === 'absent') return 'grey.500';
  if (evaluation === 'wrongPlace') return 'warning.light';
  if (evaluation === 'correct') return 'success.light';
}

function determineLetterToDisplay(
  gameState,
  rowIndex,
  currRowIndex,
  letterIndex,
  currGuess
) {
  if (gameState) {
    const { boardState } = gameState;
    if (currRowIndex === rowIndex) return currGuess[letterIndex];
    if (!boardState[rowIndex]) return '';
    // previously guessed words
    if (boardState[rowIndex]) {
      return boardState[rowIndex][letterIndex];
    }
  }
  return '';
}

export default function Cell({
  rowIndex,
  letterIndex,
  gameState,
  evaluationGuesses,
  currRowIndex,
  currGuess,
}) {
  return (
    <div>
      <Box
        sx={{
          display: 'inline-block',
          flex: 1,
          width: '50px',
          height: '50px',
          border: '1px solid black',
          backgroundColor:
            // color guessed words
            // check if evalutations for row exists
            rowIndex < currRowIndex && evaluationGuesses[rowIndex]
              ? `${determineColor(evaluationGuesses[rowIndex][letterIndex])}`
              : 'grey.200',
        }}
      >
        {determineLetterToDisplay(
          gameState,
          rowIndex,
          currRowIndex,
          letterIndex,
          currGuess
        )}
      </Box>
    </div>
  );
}
