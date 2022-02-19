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
import { MaterialUISwitch } from './MaterialUISwitch';
import { IOSSwitch } from './IOSSwitch';

export default function DeleteConfirmDialog({ onClose, open }) {
  const currTheme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const { highContrastMode, setHighContrastMode } = useContext(
    HighContrastModeContext
  );

  function handleToggle(e) {
    setHighContrastMode(e.target.checked ? 'true' : 'false');
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ textAlign: 'center' }}>Settings</DialogTitle>
      <DialogContent>
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
            inputProps={{ 'aria-label': 'dark mode - light mode toggle' }}
          />
        </Box>
        <Box>
          High Contrast Mode{' '}
          <IOSSwitch
            sx={{
              my: {
                xs: 2,
                md: 0,
              },
            }}
            checked={highContrastMode === 'true'}
            onChange={handleToggle}
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
