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
    if (letterGuessState === '') return 'color-un-used-light';
    if (letterGuessState === 'absent') return 'color-absent-light';
    if (letterGuessState === 'wrongPlace') return 'color-wrong-place-light';
    if (letterGuessState === 'correct') return 'color-correct-light';
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
              // onClick={() => handleKey(letter)}
              sx={{
                color: 'var(--color-text-light)',
                backgroundColor: `var(--${determineButtonColor(letter)})`,
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
