import PropTypes from 'prop-types';
import Head from 'next/head';
import { CssBaseline } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from '../components/createEmotionCache';
import { HighContrastModeProvider } from '../contexts/HighContrastMode.context';
import { HardModeProvider } from '../contexts/HardMode.context';
import { ColorModeProvider } from '../contexts/ColorMode.context';

import '../styles/globals.css';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <HardModeProvider>
        <HighContrastModeProvider>
          <ColorModeProvider>
            <CssBaseline />
            <Component {...pageProps} />
          </ColorModeProvider>
        </HighContrastModeProvider>
      </HardModeProvider>
    </CacheProvider>
  );
}

export default MyApp;

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
