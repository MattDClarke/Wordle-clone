import { Typography } from '@mui/material';
import DateTimeDisplay from './DateTimeDisplay';

export default function ShowCounter({ hours, minutes, seconds }) {
  return (
    <div style={{ textAlign: 'center', padding: '1rem' }}>
      <Typography variant="subtitle" component="h3">
        Next Wordle
      </Typography>

      <Typography variant="h1" component="div">
        <DateTimeDisplay value={hours} />
        :
        <DateTimeDisplay value={minutes} />
        :
        <DateTimeDisplay value={seconds} />
      </Typography>
    </div>
  );
}
