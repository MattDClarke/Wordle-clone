import { Box } from '@mui/material';
import { useContext } from 'react';
import { HighContrastModeContext } from '../contexts/HighContrastMode.context';

function determineColor(evaluation, highContrastMode) {
  if (evaluation === 'absent') return 'var(--color-gray-500)';
  if (evaluation === 'wrongPlace') {
    if (highContrastMode === 'true') {
      return 'var(--color-alert-high-contrast)';
    }
    return 'var(--color-alert)';
  }
  if (evaluation === 'correct') {
    if (highContrastMode === 'true') {
      return 'var(--color-success-high-contrast)';
    }
    return 'var(--color-success)';
  }
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
  currRowIndex,
  currGuess,
}) {
  // evaluations is an added property - if it does not exist (undefined) - set to empty array
  const { evaluations = [] } = gameState;
  const { highContrastMode } = useContext(HighContrastModeContext);
  return (
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
        borderColor: 'var(--color-gray-300)',
        color: 'var(--color-text)',
        backgroundColor:
          // color guessed words
          // check if evalutations for row exists
          rowIndex < currRowIndex && evaluations[rowIndex]
            ? `${determineColor(
                evaluations[rowIndex][letterIndex],
                highContrastMode
              )}`
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
  );
}
