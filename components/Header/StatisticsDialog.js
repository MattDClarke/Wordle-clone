import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export default function StatisticsDialog({
  children,
  onClose,
  open,
  statisticsState,
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ textAlign: 'center' }}>Statistics</DialogTitle>
      <DialogContent>
        <div>Played: {statisticsState.gamesPlayed}</div>
        {/* <div>Average num of guesses: {statisticsState.averageGuesses}</div> */}
        <div>
          Win %:{' '}
          {statisticsState.gamesPlayed === 0
            ? 'No games played yet'
            : Math.round(
                (statisticsState.gamesWon / statisticsState.gamesPlayed) * 100
              )}
        </div>
        <div>Current Streak: {statisticsState.currentStreak}</div>
        <div>Max Streak: {statisticsState.maxStreak}</div>
        {children}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
