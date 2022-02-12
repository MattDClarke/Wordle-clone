function determineColor(evaluation) {
  if (evaluation === 'absent') return 'color-absent-light';
  if (evaluation === 'wrongPlace') return 'color-wrong-place-light';
  if (evaluation === 'correct') return 'color-correct-light';
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
      <div
        style={{
          display: 'inline-block',
          flex: 1,
          width: '50px',
          height: '50px',
          border: '1px solid black',
          backgroundColor:
            // color guessed words
            // check if evalutations for row exists
            rowIndex < currRowIndex && evaluationGuesses[rowIndex]
              ? `var(--${determineColor(
                  evaluationGuesses[rowIndex][letterIndex]
                )})`
              : 'var(--color-background-light)',
        }}
      >
        {determineLetterToDisplay(
          gameState,
          rowIndex,
          currRowIndex,
          letterIndex,
          currGuess
        )}
      </div>
    </div>
  );
}
