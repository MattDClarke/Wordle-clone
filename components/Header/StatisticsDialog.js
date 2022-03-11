import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export default function StatisticsDialog({
  onClose,
  open,
  gameState,
  statisticsState,
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ textAlign: 'center' }}>Statistics</DialogTitle>
      <DialogContent>
        <div>Played: {statisticsState.gamesPlayed}</div>
        <div>Average num of guesses: {statisticsState.averageGuesses}</div>
        <div>
          Win %:
          {Math.round(
            (statisticsState.gamesWon / statisticsState.gamesPlayed) * 100
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
