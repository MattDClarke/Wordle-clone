import { Button } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';

export default function ShareButton() {
  return (
    <Button
      variant="contained"
      color="success"
      endIcon={<ShareIcon />}
      sx={{ height: '45px' }}
    >
      Share
    </Button>
  );
}
