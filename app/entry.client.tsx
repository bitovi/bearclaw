/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/docs/en/main/file-conventions/entry.client
 */

import { RemixBrowser, useLocation, useMatches } from "@remix-run/react";
import {
  startTransition,
  StrictMode,
  useMemo,
  useState,
  useEffect,
} from "react";
import { hydrateRoot } from "react-dom/client";
import * as Sentry from "@sentry/remix";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import ClientStyleContext from "./styles/ClientStyleContext";
import createEmotionCache from "./styles/createEmotionCache";
import theme from "./styles/theme";

if (window.ENV?.SENTRY_DSN !== undefined) {
  Sentry.init({
    dsn: window.ENV.SENTRY_DSN,
    tracesSampleRate: 1,
    integrations: [
      new Sentry.BrowserTracing({
        routingInstrumentation: Sentry.remixRouterInstrumentation(
          useEffect,
          useLocation,
          useMatches
        ),
      }),
    ],
  });
}

interface ClientStylingCacheProviderProps {
  children: React.ReactNode;
}

function ClientStylingCacheProvider({
  children,
}: ClientStylingCacheProviderProps) {
  const [cache, setCache] = useState(createEmotionCache());

  const clientStyleContextValue = useMemo(
    () => ({
      reset() {
        setCache(createEmotionCache());
      },
    }),
    []
  );

  return (
    <ClientStyleContext.Provider value={clientStyleContextValue}>
      <CacheProvider value={cache}>{children}</CacheProvider>
    </ClientStyleContext.Provider>
  );
}

startTransition(() => {
  hydrateRoot(
    document,
    <ClientStylingCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RemixBrowser />
      </ThemeProvider>
    </ClientStylingCacheProvider>
  );
});
