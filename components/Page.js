import { styled } from '@mui/material/styles';
import Header from './Header';

const InnerStyles = styled('div')(() => ({
  maxWidth: '1000px',
  margin: '0 auto',
  padding: '1rem',
}));

export default function Page({ children }) {
  return (
    <div>
      <Header />
      <InnerStyles>{children}</InnerStyles>
    </div>
  );
}
