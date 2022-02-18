import React, { useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { ColorModeContext } from '../../contexts/colorMode.context';
import { MaterialUISwitch } from './MaterialUISwitch';

export default function DeleteConfirmDialog({ onClose, open }) {
  const currTheme = useTheme();
  const colorMode = useContext(ColorModeContext);

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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
