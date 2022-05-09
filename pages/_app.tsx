import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
// import theme from '../src/theme';
import createEmotionCache from "../src/createEmotionCache";
import { QueryClient, QueryClientProvider } from "react-query";
import { NextQueryParamProvider } from "next-query-params";
import { createTheme, PaletteMode } from "@mui/material";
import ChangeTheme from "../components/ChangeTheme";
import { getStoredTheme, getThemeOptions, setStoredTheme } from "../src/theme";
import "../styles/styles.css";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();
const queryClient = new QueryClient();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const [mode, setMode] = useState<PaletteMode>("light"); // default is dark mode

  useEffect(() => {
    const storedTheme = getStoredTheme();

    if (storedTheme) {
      setMode(storedTheme);
    }
  }, []);
  const theme = useMemo(() => createTheme(getThemeOptions(mode)), [mode]);

  return (
    <QueryClientProvider client={queryClient}>
      <CacheProvider value={emotionCache}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <ChangeTheme
            mode={mode}
            onClick={() => {
              const newMode: PaletteMode = mode === "dark" ? "light" : "dark";
              setMode(newMode);
              setStoredTheme(newMode);
            }}
          />
          <NextQueryParamProvider>
            <Component {...pageProps} />
          </NextQueryParamProvider>
        </ThemeProvider>
      </CacheProvider>
    </QueryClientProvider>
  );
}
