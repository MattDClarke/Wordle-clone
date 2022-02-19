import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import { useContext } from 'react';
import { HighContrastModeContext } from '../contexts/HighContrastMode.context';

const keyboardRow1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
const keyboardRow2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
const keyboardRow3 = ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'];
const keyboardRows = [keyboardRow1, keyboardRow2, keyboardRow3];

export default function Keyboard({ evaluationLetters, handleKey, gameStatus }) {
  const { highContrastMode } = useContext(HighContrastModeContext);

  function determineButtonColor(letter) {
    let letterGuessState;

    if (letter === 'ENTER' || letter === 'BACKSPACE') {
      letterGuessState = '';
    } else {
      letterGuessState = evaluationLetters[letter];
    }
    if (letterGuessState === '' || letterGuessState === undefined)
      return 'var(--color-gray-100)';
    if (letterGuessState === 'absent') return 'var(--color-gray-500)';
    if (letterGuessState === 'wrongPlace') {
      if (highContrastMode === 'true') {
        return 'var(--color-alert-high-contrast)';
      }
      return 'var(--color-alert)';
    }
    if (letterGuessState === 'correct') {
      if (highContrastMode === 'true') {
        return 'var(--color-success-high-contrast)';
      }
      return 'var(--color-success)';
    }
  }

  function handleClick(e) {
    // prevent setting currGuess state if game not active
    //    after win and page refresh - prevent setting currGuess state
    if (gameStatus !== 'active') return;
    handleKey(e.target.value);
  }

  return (
    <Box sx={{ textAlign: 'center' }}>
      {keyboardRows.map((keyboardRow, i) => (
        <div key={i}>
          {keyboardRow.map((letter) => {
            const buttonColor = determineButtonColor(letter);
            return (
              <Button
                variant="contained"
                key={letter}
                value={letter}
                disabled={gameStatus !== 'active'}
                onClick={handleClick}
                sx={{
                  color: 'var(--color-text)',
                  backgroundColor: buttonColor,
                  '&.MuiButtonBase-root:hover': {
                    bgcolor: buttonColor,
                  },
                  '&.Mui-disabled': {
                    bgcolor: buttonColor,
                  },
                }}
              >
                {letter}
              </Button>
            );
          })}
        </div>
      ))}
    </Box>
  );
}