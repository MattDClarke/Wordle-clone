import Button from '@mui/material/Button';
import useGameState from '../hooks/useGameState';

const alphabet = [...'abcdefghijklmnopqrstuvwxyz'];
const keyboardRow1 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
const keyboardRow2 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
const keyboardRow3 = ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Delete'];
const keyboardRows = [keyboardRow1, keyboardRow2, keyboardRow3];

const lettersUsedObject = {};

export default function Keyboard({
  setEnterPress,
  boardState,
  rowIndex,
  evaluationsState,
  currWordState,
  deleteLastCurrWordStateLetter,
  currWordStateUpdateClick,
}) {
  // add to lettersUsedObject after word guessed
  if (boardState[rowIndex] !== '') {
    // determine state of each letter for keyboard: 'absent, 'wrongPlace' or 'correct'
    const boardLetters = boardState
      .filter((guess) => guess !== '')
      .map((str) => [...str.toLowerCase()])
      .flat();

    const evaluations = evaluationsState
      // just need to check 1st letter evaluation - the rest will be '' too
      .filter((evaluation) => evaluation[0] !== '')
      .flat();

    // create object showing state of each letter used in guesses
    // map letters to their evaluations
    boardLetters.forEach((key, i) => {
      // prevent 'wrongPlace' overwriting 'correct'
      //    'correct' should overwrite 'wrongPlace'
      if (
        evaluations[i] === 'wrongPlace' &&
        lettersUsedObject[boardLetters[i]] === 'correct'
      ) {
        return;
      }
      lettersUsedObject[key] = evaluations[i];
    });
  }

  function determineButtonColor(letter) {
    let letterGuessState;

    if (letter === 'Enter' || letter === 'Delete') {
      letterGuessState = '';
    } else {
      letterGuessState = lettersUsedObject[letter];
    }
    if (letterGuessState === '') return 'color-un-used-light';
    if (letterGuessState === 'absent') return 'color-absent-light';
    if (letterGuessState === 'wrongPlace') return 'color-wrong-place-light';
    if (letterGuessState === 'correct') return 'color-correct-light';
  }

  function handleClick(e) {
    const btn = e.target.value;
    if (btn === 'Delete') {
      console.log('Del');
      deleteLastCurrWordStateLetter();
    }
    if (btn === 'Enter') {
      console.log('enter');
      setEnterPress(true);
      setTimeout(() => {
        setEnterPress(false);
      }, 100);
    }
    if (alphabet.includes(btn)) {
      const currLetterIndex = currWordState.filter((letter) => !!letter).length;
      currWordStateUpdateClick(currLetterIndex, btn);
    }
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
              // disabled={gameStatus !== 'active'}
              onClick={handleClick}
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
