import { useMemo, createContext } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

export function ColorModeProvider({ children }) {
  const [mode, setMode] = useLocalStorage('colorMode', 'light');
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [setMode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          // prevent messing with colorMode local storage in dev tools
          mode: `${mode === 'light' || mode === 'dark' ? mode : 'light'}`,
        },
        typography: {
          button: {
            // default is uppercase
            textTransform: 'none',
            margin: '0.2rem',
          },
        },
        // MUI defaults + custom (xsSm, smMd)
        breakpoints: {
          values: {
            xs: 0,
            xsSm: 500,
            sm: 600,
            smSmMd: 720,
            smMd: 768,
            md: 900,
            lg: 1200,
            xl: 1536,
          },
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              '&::selection': {
                background: `${mode === 'light' ? '#ff9800' : '#e65100'}`,
              },

              body: {
                scrollbarColor: '#6b6b6b #2b2b2b',
                '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
                  backgroundColor: `${
                    mode === 'light' ? '#bdbdbd' : '#2b2b2b'
                  }`,
                },
                '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
                  borderRadius: 8,
                  backgroundColor: `${
                    mode === 'light' ? '#1976d2' : '#9c27b0'
                  }`,
                  minHeight: 24,
                  border: `3px solid ${
                    mode === 'light' ? '#bdbdbd' : '#2b2b2b'
                  }`,
                },
                '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover':
                  {
                    backgroundColor: `${
                      mode === 'light' ? '#42a5f5' : '#ba68c8'
                    }`,
                  },
              },
            },
          },
        },
      }),
    [mode]
  );

  // responsive Typography
  theme.typography.h1 = {
    fontSize: 23,
    // px: 2,
    [theme.breakpoints.up('sm')]: {
      fontSize: 30,
    },
  };
  theme.typography.subtitle1 = {
    fontSize: 20,
    paddingLeft: 2,
    [theme.breakpoints.up('sm')]: {
      fontSize: 23,
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: 26,
    },
  };
  theme.typography.h2 = {
    fontSize: 20,
    paddingLeft: 2,
    [theme.breakpoints.up('sm')]: {
      fontSize: 23,
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: 26,
    },
  };
  theme.typography.h3 = {
    fontSize: 18,
    [theme.breakpoints.up('sm')]: {
      fontSize: 21,
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: 24,
    },
  };
  theme.typography.h4 = {
    fontSize: 16,
    [theme.breakpoints.up('sm')]: {
      fontSize: 19,
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: 22,
    },
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
}
