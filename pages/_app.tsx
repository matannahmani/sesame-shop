import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { getThemeOptions, setStoredTheme } from '../src/theme';
import createEmotionCache from '../src/createEmotionCache';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider, useAtom } from 'jotai';
import { SnackbarProvider } from 'notistack';
import { useMemo, useEffect, useState } from 'react';
import { createTheme, PaletteMode, responsiveFontSizes } from '@mui/material';
import { getStoredTheme } from '../src/theme';
import ChangeTheme from '../components/ChangeTheme';
import { darkModeAtom } from '../components/ChangeTheme';
import { getDesignTokens } from '../src/theme2';
import { koKR } from '@mui/material/locale';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();
const queryClient = new QueryClient();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const [darkMode, setDarkMode] = useAtom(darkModeAtom);
  const theme = useMemo(() => {
    const paletteMode = darkMode ? 'dark' : 'light';
    // @ts-ignore
    let myTheme = createTheme({ ...getDesignTokens(paletteMode) }, koKR);
    myTheme = responsiveFontSizes(myTheme);
    myTheme.palette.mode = paletteMode;
    return myTheme;
  }, [darkMode]);

  useEffect(() => {
    console.log('theme changed', theme);
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <CacheProvider value={emotionCache}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />

          <Provider>
            <SnackbarProvider maxSnack={3}>
              {/* <ChangeTheme /> */}
              <Component {...pageProps} />
            </SnackbarProvider>
          </Provider>
        </ThemeProvider>
      </CacheProvider>
    </QueryClientProvider>
  );
}
