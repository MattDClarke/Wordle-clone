import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import { Typography } from '@mui/material';

const HeaderStyles = styled('header')(() => ({
  display: 'flex',
  padding: '0.5rem 1rem',
  alignItems: 'center',
  borderBottom: '1px solid #9a9e87',
  '& h1': {
    flex: 1,
    textAlign: 'center',
    margin: 0,
  },
}));

export default function Header() {
  return (
    <HeaderStyles>
      <div style={{ width: '96px' }}>
        <IconButton aria-label="How to Play">
          <HelpOutlineIcon />
        </IconButton>
      </div>
      <Typography variant="h1">Wordle</Typography>
      {/* <div> */}
      <IconButton aria-label="Statistics">
        <BarChartIcon />
      </IconButton>
      <IconButton aria-label="Settings">
        <SettingsIcon />
      </IconButton>
      {/* </div> */}
    </HeaderStyles>
  );
}
