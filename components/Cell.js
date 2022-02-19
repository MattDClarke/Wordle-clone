import { Box } from '@mui/material';

function determineColor(evaluation) {
  if (evaluation === 'absent') return 'var(--color-gray-500)';
  if (evaluation === 'wrongPlace') return 'var(--color-alert)';
  if (evaluation === 'correct') return 'var(--color-success)';
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
          borderColor: 'var(--color-gray-500)',
          color: 'var(--color-text)',
          backgroundColor:
            // color guessed words
            // check if evalutations for row exists
            rowIndex < currRowIndex && evaluationGuesses[rowIndex]
              ? `${determineColor(evaluationGuesses[rowIndex][letterIndex])}`
              : 'var(--color-background)',
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
