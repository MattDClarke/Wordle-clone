import { styled } from '@mui/material/styles';
import List from '@mui/material/List';

const PREFIX = 'List';
export const classes = {
  root: `${PREFIX}-root`,
  ListItem: `${PREFIX}-ListItem`,
  container: `${PREFIX}-container`,
  title: `${PREFIX}-title`,
};

export const ListRoot = styled(List)(() => ({
  [`& .${classes.ListItem}`]: {
    display: 'block',
    padding: '1rem 0',
  },
  [`& .${classes.container}`]: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  [`& .${classes.title}`]: {
    fontSize: '1.15rem',
    fontWeight: 'bold',
  },
}));
