import { Grid, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import BarChart from './BarChart';

import { classes, GridRoot } from './styles/StatisticsDialogStyles';

export default function StatisticsDialog({
  children,
  onClose,
  open,
  statisticsState,
}) {
  function getFormattedDate(ts) {
    const date = new Date(ts);
    const [year, day] = [date.getFullYear(), date.getDate()];
    const month = date.toLocaleString('default', { month: 'long' });
    return `${day} ${month} ${year}`;
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ textAlign: 'center' }}>Statistics</DialogTitle>
      <DialogContent>
        {statisticsState.gamesPlayed === 0 ? (
          <div>No games completed yet.</div>
        ) : (
          <>
            <GridRoot container>
              <Grid item xs={3} className={classes.GridItemValue}>
                {statisticsState.gamesPlayed}
              </Grid>
              <Grid item xs={3} className={classes.GridItemValue}>
                {Math.round(
                  (statisticsState.gamesWon / statisticsState.gamesPlayed) * 100
                )}
              </Grid>
              <Grid item xs={3} className={classes.GridItemValue}>
                {statisticsState.currentStreak}
              </Grid>
              <Grid item xs={3} className={classes.GridItemValue}>
                {statisticsState.maxStreak}
              </Grid>
              <Grid item xs={3} className={classes.GridItemTitle}>
                Played
              </Grid>
              <Grid item xs={3} className={classes.GridItemTitle}>
                Win %
              </Grid>
              <Grid item xs={3} className={classes.GridItemTitle}>
                <div>Current</div>
                <div>Streak</div>
              </Grid>
              <Grid item xs={3} className={classes.GridItemTitle}>
                <div>Max</div>
                <div>Streak</div>
              </Grid>
            </GridRoot>
            {statisticsState.gamesWon > 0 && (
              <>
                <Typography
                  variant="subtitle"
                  component="h3"
                  sx={{ textAlign: 'center', paddingTop: '1rem' }}
                >
                  Guess Distribution
                </Typography>
                <BarChart statisticsState={statisticsState} />
              </>
            )}
          </>
        )}
        {children}
        {statisticsState.lastPlayedTs ? (
          <div style={{ textAlign: 'center', paddingTop: '1rem' }}>
            <b>Last played: </b>{' '}
            <span>{getFormattedDate(statisticsState.lastPlayedTs)}</span>
          </div>
        ) : (
          ''
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
