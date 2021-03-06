import { useState, memo } from 'react';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import { Typography } from '@mui/material';
import HowToPlayDialog from './HowToPlayDialog';
import StatisticsDialog from './StatisticsDialog';
import SettingsDialog from './SettingsDialog';

const HeaderStyles = styled('header')(() => ({
  display: 'flex',
  padding: '0.5rem 1rem',
  alignItems: 'center',
  borderBottom: '1px solid var(--color-gray-500)',
  '& h1': {
    flex: 1,
    textAlign: 'center',
    margin: 0,
    color: 'var(--color-text)',
  },
  backgroundColor: 'var(--color-background)',
}));

function Header({
  children,
  gameState,
  setInfoMsg,
  setCountInfoMsgs,
  statisticsState,
  openStatistics,
  setOpenStatistics,
}) {
  const [openHowToPlay, setOpenHowToPlay] = useState(() => {
    // show how to play Dialog on page load if no games played or started
    if (
      statisticsState.gamesPlayed === 0 &&
      gameState.boardState.length === 0
    ) {
      return true;
    }
    return false;
  });
  const [openSettings, setOpenSettings] = useState(false);

  const handleClickOpenHowToPlay = () => {
    setOpenHowToPlay(true);
  };

  const handleClickOpenStatistics = () => {
    setOpenStatistics(true);
  };

  const handleClickOpenSettings = () => {
    setOpenSettings(true);
  };

  const handleCloseHowToPlay = () => {
    setOpenHowToPlay(false);
  };

  const handleCloseStatistics = () => {
    setOpenStatistics(false);
  };

  const handleCloseSettings = () => {
    setOpenSettings(false);
  };

  return (
    <>
      <HeaderStyles>
        <div style={{ width: '96px' }}>
          <IconButton
            aria-label="How to Play"
            onClick={handleClickOpenHowToPlay}
          >
            <HelpOutlineIcon />
          </IconButton>
        </div>
        <Typography variant="h1">Wordle</Typography>
        <IconButton aria-label="Statistics" onClick={handleClickOpenStatistics}>
          <BarChartIcon />
        </IconButton>
        <IconButton aria-label="Settings" onClick={handleClickOpenSettings}>
          <SettingsIcon />
        </IconButton>
      </HeaderStyles>

      <HowToPlayDialog open={openHowToPlay} onClose={handleCloseHowToPlay} />
      <StatisticsDialog
        open={openStatistics}
        onClose={handleCloseStatistics}
        gameState={gameState}
        statisticsState={statisticsState}
      >
        {children}
      </StatisticsDialog>
      <SettingsDialog
        open={openSettings}
        onClose={handleCloseSettings}
        gameState={gameState}
        setInfoMsg={setInfoMsg}
        setCountInfoMsgs={setCountInfoMsgs}
      />
    </>
  );
}

export default memo(Header);
