import { useContext } from 'react';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import BackspaceOutlinedIcon from '@mui/icons-material/BackspaceOutlined';
import { motion } from 'framer-motion';

import { HighContrastModeContext } from '../contexts/HighContrastMode.context';

const keyboardRow1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
const keyboardRow2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
const keyboardRow3 = ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'];
const keyboardRows = [keyboardRow1, keyboardRow2, keyboardRow3];

export default function Keyboard({
  evaluationLetters,
  handleKey,
  gameStatus,
  isLoading,
}) {
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
    console.log('in keyboard', e.target.value);
    handleKey(e.target.value);
  }

  return (
    <Box sx={{ textAlign: 'center' }}>
      {keyboardRows.map((keyboardRow, i) => (
        <div
          key={i}
          style={{ display: 'flex', width: '90vw', maxWidth: '500px' }}
        >
          {keyboardRow.map((letter) => {
            const buttonColor = determineButtonColor(letter);
            return (
              <motion.div
                key={letter}
                whileHover={{ scale: 1.1 }}
                whileFocus={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 500 }}
                style={{ flex: 1 }}
              >
                <Button
                  variant="contained"
                  value={letter}
                  disabled={gameStatus !== 'active' || isLoading}
                  onClick={handleClick}
                  sx={{
                    color: 'var(--color-text)',
                    backgroundColor: buttonColor,
                    minWidth: 0,
                    padding: '1rem 0.25rem',
                    width: '90%',

                    '&.MuiButtonBase-root:hover': {
                      bgcolor: buttonColor,
                    },
                    '&.Mui-disabled': {
                      bgcolor: buttonColor,
                    },
                  }}
                >
                  {letter !== 'BACKSPACE' ? (
                    letter
                  ) : (
                    <BackspaceOutlinedIcon style={{ pointerEvents: 'none' }} />
                  )}
                </Button>
              </motion.div>
            );
          })}
        </div>
      ))}
    </Box>
  );
}
