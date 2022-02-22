import { styled } from '@mui/material/styles';

const PREFIX = 'section';
export const classes = {
  textBlock: `${PREFIX}-textBlock`,
  cellRow: `${PREFIX}-cellRow`,
};

export const SectionRoot = styled('section')(() => ({
  [`& .${classes.textBlock}`]: {
    paddingBottom: '1rem',
  },
  [`& .${classes.cellRow}`]: {
    display: 'flex',
    paddingBottom: '0.5rem',
    '& div': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2rem',
      fontWeight: 900,
      width: '50px',
      height: '50px',
      margin: '0.1rem',
      border: '2px solid var(--color-gray-500)',
      color: 'var(--color-text)',
    },
  },
}));
