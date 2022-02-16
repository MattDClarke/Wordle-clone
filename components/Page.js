import { styled } from '@mui/material/styles';
import Image from 'next/image';
import Header from './Header/Header';

const PageStyles = styled('div')(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.paper,
}));

const InnerStyles = styled('main')(() => ({
  maxWidth: '1000px',
  margin: '0 auto',
  padding: '2rem',
  flex: 1,
}));

export default function Page({ children }) {
  return (
    <PageStyles>
      <Header />
      <InnerStyles>{children}</InnerStyles>
      <footer style={{ textAlign: 'center', padding: '1rem' }}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by
          <span>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </PageStyles>
  );
}
