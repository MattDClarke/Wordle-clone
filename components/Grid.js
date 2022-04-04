import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import Cell from './Cell';

const GridStyles = styled('div')(() => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
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
  initial: { rotateY: 90 },
  animate: {
    rotateY: 0,
    transition: {
      ease: [0.6, 0.01, -0.05, 0.95],
      duration: 1,
    },
  },
};

const cellWinVariants = {
  initial: { rotateY: 90, y: -50, x: -50 },
  animate: {
    rotateY: 0,
    y: 0,
    x: 0,
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
  wordLength,
  currRowIndex,
  currGuess,
  infoMsg
) {
  const { boardState, solution } = gameState;
  // evaluations is an added property - if it does not exist (undefined) - set to empty array
  const { evaluations = [] } = gameState;
  return (
    <div
      key={
        rowIndex === currRowIndex && rowIndex !== boardState.length
          ? uuidv4()
          : `${boardState[rowIndex] ?? ''} ${rowIndex}`
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
            rowIndex < currRowIndex && evaluations[rowIndex] ? (
              <motion.div
                key={letterIndex + evaluations[rowIndex]}
                variants={
                  boardState[rowIndex] === solution
                    ? cellWinVariants
                    : cellVariants
                }
              >
                <Cell
                  rowIndex={rowIndex}
                  letterIndex={letterIndex}
                  gameState={gameState}
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
  wordLength,
  currRowIndex,
  numOfRows,
  currGuess,
  infoMsg,
  isLoading,
}) {
  return (
    <GridStyles>
      {isLoading ? <p>Getting word of the day...</p> : ''}
      {Array(numOfRows)
        .fill(1)
        .map((el, rowIndex) =>
          generateRow(
            rowIndex,
            gameState,
            wordLength,
            currRowIndex,
            currGuess,
            infoMsg
          )
        )}
    </GridStyles>
  );
}
