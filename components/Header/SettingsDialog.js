import React, { useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { ColorModeContext } from '../../contexts/ColorMode.context';
import { HighContrastModeContext } from '../../contexts/HighContrastMode.context';
import { HardModeContext } from '../../contexts/HardMode.context';
import { MaterialUISwitch } from './MaterialUISwitch';
import { IOSSwitch } from './IOSSwitch';

export default function SettingsDialog({
  onClose,
  open,
  gameState,
  setInfoMsg,
  setCountInfoMsgs,
}) {
  const currTheme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const { highContrastMode, setHighContrastMode } = useContext(
    HighContrastModeContext
  );
  const { hardMode, setHardMode } = useContext(HardModeContext);

  function handleHardModeToggle(e) {
    // prevent toggle on when boardState !== [] (game started)
    const { boardState, solution } = gameState;
    const isGameOver = boardState.includes(solution) || boardState.length === 6;
    if (
      e.target.checked &&
      boardState.length !== 0 &&
      // allow toggle after game over
      !isGameOver
    ) {
      setInfoMsg('Hard mode can only be enabled at the start of a round');
      setCountInfoMsgs((prevCount) => prevCount + 1);
      setHardMode('false');
      return;
    }
    setHardMode(e.target.checked ? 'true' : 'false');
  }

  function handleHighContrastModeToggle(e) {
    setHighContrastMode(e.target.checked ? 'true' : 'false');
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ textAlign: 'center' }}>Settings</DialogTitle>
      <DialogContent>
        <Box>
          Hard Mode Any revealed hints must be used in subsequent guesses
          <IOSSwitch
            sx={{
              my: {
                xs: 2,
                md: 0,
              },
            }}
            checked={hardMode === 'true'}
            // disabled={hardMode === 'false' && gameState.boardState.length !== 0}
            onChange={handleHardModeToggle}
            inputProps={{ 'aria-label': 'Hard mode toggle' }}
          />
        </Box>
        <Box>
          Dark Mode{' '}
          <MaterialUISwitch
            sx={{
              my: {
                xs: 2,
                md: 0,
              },
            }}
            checked={currTheme.palette.mode === 'dark'}
            onChange={colorMode.toggleColorMode}
            inputProps={{ 'aria-label': 'Dark mode - light mode toggle' }}
          />
        </Box>
        <Box>
          High Contrast Mode. For improved color vision
          <IOSSwitch
            sx={{
              my: {
                xs: 2,
                md: 0,
              },
            }}
            checked={highContrastMode === 'true'}
            onChange={handleHighContrastModeToggle}
            inputProps={{ 'aria-label': 'High contrast mode toggle' }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
