import Button from '@mui/material/Button';

const keyboardRow1 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
const keyboardRow2 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
const keyboardRow3 = ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace'];
const keyboardRows = [keyboardRow1, keyboardRow2, keyboardRow3];

export default function Keyboard({ evaluationLetters, handleKey, gameStatus }) {
  function determineButtonColor(letter) {
    let letterGuessState;

    if (letter === 'Enter' || letter === 'Backspace') {
      letterGuessState = '';
    } else {
      letterGuessState = evaluationLetters[letter];
    }
    if (letterGuessState === '' || letterGuessState === undefined)
      return 'grey.200';
    if (letterGuessState === 'absent') return 'grey.500';
    if (letterGuessState === 'wrongPlace') return 'warning.light';
    if (letterGuessState === 'correct') return 'success.light';
  }

  function handleClick(e) {
    // prevent setting currGuess state if game not active
    //    after win and page refresh - prevent setting currGuess state
    if (gameStatus !== 'active') return;
    handleKey(e.target.value);
  }

  return (
    <div>
      {keyboardRows.map((keyboardRow, i) => (
        <div key={i}>
          {keyboardRow.map((letter) => (
            <Button
              variant="contained"
              key={letter}
              value={letter}
              // TODO: change MUI button disabled and hover styling
              // disabled={gameStatus !== 'active'}
              onClick={handleClick}
              sx={{
                color: 'text.primary',
                backgroundColor: `${determineButtonColor(letter)}`,
                '&.MuiButtonBase-root:hover': {
                  bgcolor: `${determineButtonColor(letter)}`,
                },
              }}
            >
              {letter}
            </Button>
          ))}
        </div>
      ))}
    </div>
  );
}
