import { useState } from 'react';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import { Typography } from '@mui/material';
import SettingsDialog from './SettingsDialog';

const HeaderStyles = styled('header')(({ theme }) => ({
  display: 'flex',
  padding: '0.5rem 1rem',
  alignItems: 'center',
  borderBottom: '1px solid #9a9e87',
  '& h1': {
    flex: 1,
    textAlign: 'center',
    margin: 0,
    color: theme.palette.text.primary,
  },
  backgroundColor: theme.palette.background.paper,
}));

export default function Header() {
  const [openSettings, setOpensettings] = useState(false);

  const handleClickOpenSettings = () => {
    setOpensettings(true);
  };

  const handleCloseSettings = () => {
    setOpensettings(false);
  };
  return (
    <>
      <HeaderStyles>
        <div style={{ width: '96px' }}>
          <IconButton aria-label="How to Play">
            <HelpOutlineIcon />
          </IconButton>
        </div>
        <Typography variant="h1">Wordle</Typography>
        <IconButton aria-label="Statistics">
          <BarChartIcon />
        </IconButton>
        <IconButton aria-label="Settings" onClick={handleClickOpenSettings}>
          <SettingsIcon />
        </IconButton>
      </HeaderStyles>
      <SettingsDialog open={openSettings} onClose={handleCloseSettings} />
    </>
  );
}
