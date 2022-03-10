import { motion } from 'framer-motion';
import { Box, Divider } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useContext } from 'react';
import { HighContrastModeContext } from '../../contexts/HighContrastMode.context';
import { classes, SectionRoot } from './styles/HowToPlayDialogStyles';

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

export default function HowToPlayDialog({ onClose, open }) {
  const { highContrastMode } = useContext(HighContrastModeContext);
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ textAlign: 'center' }}>How To Play</DialogTitle>
      <DialogContent>
        <SectionRoot>
          <div>
            <div className={classes.textBlock}>
              Guess the <strong>WORDLE</strong> in six tries.
            </div>
            <div className={classes.textBlock}>
              Each guess must be a valid five-letter word. Hit the enter button
              to submit.
            </div>
            <div className={classes.textBlock}>
              After each guess, the color of the tiles will change to show how
              close your guess was to the word.
            </div>
          </div>
          <Divider />
          <div>
            <p>
              <strong>Examples</strong>
            </p>
            <div className={classes.cellRow}>
              <motion.div
                style={{ border: 0 }}
                variants={cellVariants}
                initial="initial"
                animate="animate"
              >
                <Box
                  sx={{
                    backgroundColor:
                      highContrastMode === 'true'
                        ? 'var(--color-success-high-contrast)'
                        : 'var(--color-success)',
                  }}
                >
                  W
                </Box>
              </motion.div>
              <div>E</div>
              <div>A</div>
              <div>R</div>
              <div>Y</div>
            </div>
            <div className={classes.textBlock}>
              The letter <strong>W</strong> is in the word and in the correct
              spot.
            </div>
            <div className={classes.cellRow}>
              <div>P</div>
              <motion.div
                style={{ border: 0 }}
                variants={cellVariants}
                initial="initial"
                animate="animate"
              >
                <Box
                  sx={{
                    backgroundColor:
                      highContrastMode === 'true'
                        ? 'var(--color-alert-high-contrast)'
                        : 'var(--color-alert)',
                  }}
                >
                  I
                </Box>
              </motion.div>
              <div>L</div>
              <div>L</div>
              <div>S</div>
            </div>
            <div className={classes.textBlock}>
              The letter <strong>I</strong> is in the word but in the wrong
              spot.
            </div>
            <div className={classes.cellRow}>
              <div>V</div>
              <div>A</div>
              <div>G</div>
              <motion.div
                style={{ border: 0 }}
                variants={cellVariants}
                initial="initial"
                animate="animate"
              >
                <Box
                  sx={{
                    backgroundColor: 'var(--color-gray-500)',
                  }}
                >
                  U
                </Box>
              </motion.div>
              <div>E</div>
            </div>
            <div className={classes.textBlock}>
              The letter <strong>U</strong> is not in the word in any spot.
            </div>
          </div>
          <Divider />
          <Box className={classes.textBlock} sx={{ pt: 2 }}>
            <strong>A new WORDLE will be available each day!</strong>
          </Box>
        </SectionRoot>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
