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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          fontWeight: 900,
          width: '50px',
          height: '50px',
          margin: '0.1rem',
          border: 2,
          borderColor: 'action.disabledBackground',
          color: 'text.primary',
          backgroundColor:
            // color guessed words
            // check if evalutations for row exists
            rowIndex < currRowIndex && evaluationGuesses[rowIndex]
              ? `${determineColor(evaluationGuesses[rowIndex][letterIndex])}`
              : 'background.paper',
        }}
      >
        <span>
          {determineLetterToDisplay(
            gameState,
            rowIndex,
            currRowIndex,
            letterIndex,
            currGuess
          )}
        </span>
      </Box>
    </div>
  );
}
