import { useMemo, createContext, useEffect, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import {
  COLORS,
  COLOR_MODE_KEY,
  INITIAL_COLOR_MODE_CSS_PROP,
} from '../lib/constants';

export const ColorModeContext = createContext();

export function ColorModeProvider({ children }) {
  const [mode, setMode] = useState(COLOR_MODE_KEY, undefined);

  // set state to CSS root variable color mode so that u can update it with toggleColorMode
  useEffect(() => {
    const root = window.document.documentElement;
    const initialColorValue = root.style.getPropertyValue(
      INITIAL_COLOR_MODE_CSS_PROP
    );
    setMode(initialColorValue);
  }, [setMode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const root = window.document.documentElement;
          const newVal = prevMode === 'light' ? 'dark' : 'light';
          Object.entries(COLORS).forEach(([name, colorByTheme]) => {
            const cssVarName = `--color-${name}`;
            root.style.setProperty(cssVarName, colorByTheme[newVal]);
          });
          window.localStorage.setItem(COLOR_MODE_KEY, newVal);
          return newVal;
        });
      },
    }),
    [setMode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          // prevent messing with colorMode local storage in dev tools
          // undefined initially (server render)
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
