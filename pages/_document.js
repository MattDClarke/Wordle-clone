import * as React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import createEmotionServer from '@emotion/server/create-instance';
import createEmotionCache from '../components/createEmotionCache';
import {
  COLOR_MODE_KEY,
  COLORS,
  INITIAL_COLOR_MODE_CSS_PROP,
  HIGH_CONTRAST_MODE_KEY,
  INITIAL_HIGH_CONTRAST_MODE_CSS_PROP,
  HARD_MODE_KEY,
  INITIAL_HARD_MODE_CSS_PROP,
} from '../constants';

// will be stringified, placeholders replaced, and immediately invoked when page loaded - will block HTML rendering
function setColorsByTheme() {
  // inital placeholder values - will be replaced
  const colors = '🌈';
  const colorModeKey = '🔑';
  const colorModeCssProp = '⚡️';
  const highContrastModeKey = '📺';
  const highContrastModeCssProp = '☀';
  const hardModeKey = '🏍';
  const hardModeCssProp = '🏎';

  // check users light / dark mode preferences
  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  const prefersDarkFromMQ = mql.matches;
  const persistedColorModePreference = localStorage.getItem(colorModeKey);

  let colorMode = 'light';

  const hasUsedColorModeToggle =
    typeof persistedColorModePreference === 'string';

  if (hasUsedColorModeToggle) {
    if (
      persistedColorModePreference === 'light' ||
      persistedColorModePreference === 'dark'
    ) {
      colorMode = persistedColorModePreference;
    } else {
      colorMode = 'light';
    }
  } else {
    colorMode = prefersDarkFromMQ ? 'dark' : 'light';
  }

  // high contrast mode preference
  let highContrastMode = 'false';
  const persistedHighContrastModePreference =
    localStorage.getItem(highContrastModeKey);

  const hasUsedHighContrastModeToggle =
    typeof persistedHighContrastModePreference === 'string';

  if (hasUsedHighContrastModeToggle) {
    if (
      persistedHighContrastModePreference === 'false' ||
      persistedHighContrastModePreference === 'true'
    ) {
      highContrastMode = persistedHighContrastModePreference;
    } else {
      highContrastMode = 'false';
    }
  } else {
    highContrastMode = 'false';
  }

  // hard mode preference
  let hardMode = 'false';
  const persistedHardModePreference = localStorage.getItem(hardModeKey);

  const hasUsedHardModeToggle = typeof persistedHardModePreference === 'string';

  if (hasUsedHardModeToggle) {
    if (
      persistedHardModePreference === 'false' ||
      persistedHardModePreference === 'true'
    ) {
      hardMode = persistedHardModePreference;
    } else {
      hardMode = 'false';
    }
  } else {
    hardMode = 'false';
  }

  // access global styles
  const root = document.documentElement;

  root.style.setProperty(colorModeCssProp, colorMode);
  root.style.setProperty(highContrastModeCssProp, highContrastMode);
  root.style.setProperty(hardModeCssProp, hardMode);

  Object.entries(colors).forEach(([name, colorByTheme]) => {
    // create the needed CSS variables
    const cssVarName = `--color-${name}`;

    root.style.setProperty(cssVarName, colorByTheme[colorMode]);
  });
}

const blockingSetInitialColorModeAndColors = () => {
  const boundFn = String(setColorsByTheme)
    .replace("'🌈'", JSON.stringify(COLORS))
    .replace('🔑', COLOR_MODE_KEY)
    .replace('⚡️', INITIAL_COLOR_MODE_CSS_PROP)
    .replace('📺', HIGH_CONTRAST_MODE_KEY)
    .replace('☀', INITIAL_HIGH_CONTRAST_MODE_CSS_PROP)
    .replace('🏍', HARD_MODE_KEY)
    .replace('🏎', INITIAL_HARD_MODE_CSS_PROP);

  // Wrap it in an IIFE - prevent polluting global namespace - dnt need to store it globally.
  return `(${boundFn})()`;
};

const FallbackStyles = function () {
  // Create a string holding each CSS variable:
  /*
    `--color-text: black;
    --color-background: white;`
  */

  const cssVariablesString = Object.entries(COLORS).reduce(
    (acc, [name, colorByTheme]) =>
      `${acc}\n--color-${name}: ${colorByTheme.light};`,
    ''
  );

  const wrappedInSelector = `html { ${cssVariablesString} }`;

  return <style>{wrappedInSelector}</style>;
};

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/static/favicon.ico" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          {/* Inject MUI styles first to match with the prepend: true configuration. */}
          {this.props.emotionStyleTags}
          <noscript>
            <FallbackStyles key="fallback-styles" />
          </noscript>
        </Head>
        <body>
          <script
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: blockingSetInitialColorModeAndColors(),
            }}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  const originalRenderPage = ctx.renderPage;

  // You can consider sharing the same emotion cache between all the SSR requests to speed up performance.
  // However, be aware that it can have global side effects.
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) =>
        function EnhanceApp(props) {
          return <App emotionCache={cache} {...props} />;
        },
    });

  const initialProps = await Document.getInitialProps(ctx);
  // This is important. It prevents emotion to render invalid HTML.
  // See https://github.com/mui/material-ui/issues/26561#issuecomment-855286153
  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    emotionStyleTags,
  };
};
