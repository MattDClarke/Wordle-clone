import React, { useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ListItem from '@mui/material/ListItem';
import { Typography } from '@mui/material';
import { ColorModeContext } from '../../contexts/ColorMode.context';
import { HighContrastModeContext } from '../../contexts/HighContrastMode.context';
import { HardModeContext } from '../../contexts/HardMode.context';
import { IOSSwitch } from './IOSSwitch';
import { classes, ListRoot } from './styles/SettingsDialogStyles';

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
        <ListRoot className={classes.root}>
          <ListItem className={classes.ListItem} divider>
            <div className={classes.container}>
              <span className={classes.title}>Hard Mode</span>
              <IOSSwitch
                checked={hardMode === 'true'}
                // disabled={hardMode === 'false' && gameState.boardState.length !== 0}
                onChange={handleHardModeToggle}
                inputProps={{ 'aria-label': 'Hard mode toggle' }}
              />
            </div>
            <Typography variant="caption" display="block" gutterBottom>
              Any revealed hints must be used in subsequent guesses
            </Typography>
          </ListItem>
          <ListItem className={classes.ListItem} divider>
            <div className={classes.container}>
              <span className={classes.title}>Dark Mode</span>
              <IOSSwitch
                checked={currTheme.palette.mode === 'dark'}
                onChange={colorMode.toggleColorMode}
                inputProps={{ 'aria-label': 'Dark mode - light mode toggle' }}
              />
            </div>
          </ListItem>
          <ListItem className={classes.ListItem} divider>
            <div className={classes.container}>
              <span className={classes.title}>High Contrast Mode</span>

              <IOSSwitch
                checked={highContrastMode === 'true'}
                onChange={handleHighContrastModeToggle}
                inputProps={{ 'aria-label': 'High contrast mode toggle' }}
              />
            </div>
            <Typography variant="caption" display="block" gutterBottom>
              For improved color vision
            </Typography>
          </ListItem>
        </ListRoot>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
