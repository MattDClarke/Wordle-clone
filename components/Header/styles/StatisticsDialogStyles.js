import { styled } from '@mui/material/styles';
import { Grid } from '@mui/material';

const PREFIX = 'List';
export const classes = {
  GridItemValue: `${PREFIX}-GridItemValue`,
  GridItemTitle: `${PREFIX}-GridItemTitle`,
};

export const GridRoot = styled(Grid)(({ theme }) => ({
  textAlign: 'center',
  [`& .${classes.GridItemValue}`]: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    [theme.breakpoints.down('xsSm')]: {
      fontSize: '0.94rem',
    },
  },
  [`& .${classes.GridItemTitle}`]: {
    [theme.breakpoints.down('xsSm')]: {
      fontSize: '0.75rem',
    },
  },
}));
