import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import Cell from './Cell';

const GridStyles = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingBottom: '1rem',
}));

const rowVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 1,
      delayChildren: 0.2,
      staggerChildren: 0.2,
    },
  },
};

const cellVariants = {
  initial: { y: 0, rotateY: 90 },
  animate: {
    y: 0,
    rotateY: 0,
    transition: {
      ease: [0.6, 0.01, -0.05, 0.95],
      duration: 1,
    },
  },
};

const itemVariants = {
  noAnimate: {
    x: 0,
  },
  animate: {
    x: [-5, 5, 0],
    transition: {
      duration: 0.1,
      repeat: 3,
    },
  },
};

function generateRow(
  rowIndex,
  gameState,
  evaluationGuesses,
  wordLength,
  currRowIndex,
  currGuess,
  infoMsg
) {
  if (rowIndex === currRowIndex) {
    console.log(
      { rowIndex },
      { currGuess },
      { evaluationGuesses },
      { gameState }
    );
  }
  return (
    // <div key={`${gameState.boardState[rowIndex] ?? 'boardState'} ${rowIndex}`}>
    <div
      key={
        rowIndex === currRowIndex && rowIndex !== gameState.boardState.length
          ? uuidv4()
          : `${gameState.boardState[rowIndex] ?? 'boardState'} ${rowIndex}`
      }
    >
      <motion.div
        variants={rowVariants}
        initial="initial"
        animate="animate"
        style={{ display: 'flex' }}
      >
        {Array(wordLength)
          .fill(1)
          .map((el, letterIndex) =>
            rowIndex < currRowIndex && evaluationGuesses[rowIndex] ? (
              <motion.div
                key={letterIndex + evaluationGuesses[rowIndex]}
                variants={cellVariants}
              >
                <Cell
                  rowIndex={rowIndex}
                  letterIndex={letterIndex}
                  gameState={gameState}
                  evaluationGuesses={evaluationGuesses}
                  currRowIndex={currRowIndex}
                  currGuess={currGuess}
                  infoMsg={infoMsg}
                />
              </motion.div>
            ) : (
              <div key={letterIndex}>
                <motion.div
                  variants={itemVariants}
                  animate={
                    infoMsg !== 'Not enough letters' &&
                    infoMsg !==
                      'Hard mode can only be enabled at the start of a round' &&
                    infoMsg !== '' &&
                    rowIndex === currRowIndex
                      ? 'animate'
                      : 'noAnimate'
                  }
                >
                  <Cell
                    rowIndex={rowIndex}
                    letterIndex={letterIndex}
                    gameState={gameState}
                    evaluationGuesses={evaluationGuesses}
                    currRowIndex={currRowIndex}
                    currGuess={currGuess}
                    infoMsg=""
                  />
                </motion.div>
              </div>
            )
          )}
      </motion.div>
    </div>
  );
}

export default function Grid({
  gameState,
  evaluationGuesses,
  wordLength,
  currRowIndex,
  numOfRows,
  currGuess,
  infoMsg,
}) {
  return (
    <GridStyles>
      {Array(numOfRows)
        .fill(1)
        .map((el, rowIndex) =>
          generateRow(
            rowIndex,
            gameState,
            evaluationGuesses,
            wordLength,
            currRowIndex,
            currGuess,
            infoMsg
          )
        )}
    </GridStyles>
  );
}
