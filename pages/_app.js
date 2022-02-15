import PropTypes from 'prop-types';
import Head from 'next/head';
import { CssBaseline } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import Page from '../components/Page';
import { ColorModeProvider } from '../contexts/colorMode.context';
import createEmotionCache from '../components/createEmotionCache';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ColorModeProvider>
        <CssBaseline />
        <Page>
          <Component {...pageProps} />
        </Page>
      </ColorModeProvider>
    </CacheProvider>
  );
}

export default MyApp;

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
