import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { withSentry } from "@sentry/remix";
import { withEmotionCache } from "@emotion/react";
import { unstable_useEnhancedEffect as useEnhancedEffect } from "@mui/material";
import rdtStylesheet from "remix-development-tools/stylesheet.css";
import { RemixDevTools } from "remix-development-tools";

import stylesheetUrl from "./styles/style.css";
import { getUser } from "./session.server";
import { useContext } from "react";
import ClientStyleContext from "./styles/ClientStyleContext";
import { startMSW } from "./entry.server";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: stylesheetUrl },
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "anonymous",
    },
    {
      href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;500&display=swap",
      rel: "stylesheet",
    },
    ...(rdtStylesheet ? [{ rel: "stylesheet", href: rdtStylesheet }] : []),
  ];
};

// process.env is not available in the browser
// so we need to pass it to the client
// and create a global type for it
// https://remix.run/docs/en/v1/guides/environment-variables
declare global {
  interface Window {
    ENV: {
      SENTRY_DSN: string;
    };
  }
}

export async function loader({ request }: LoaderArgs) {
  startMSW();
  return json({
    user: await getUser(request),
    ENV: {
      SENTRY_DSN: process.env.SENTRY_DSN,
    },
  });
}

// MUI setup borrowed from https://github.com/mui/material-ui/tree/master/examples/material-remix-ts
const App = withEmotionCache((_, emotionCache) => {
  const { ENV } = useLoaderData<typeof loader>();
  const clientStyleData = useContext(ClientStyleContext);

  // Only executed on client
  useEnhancedEffect(() => {
    // re-link sheet container
    emotionCache.sheet.container = document.head;
    // re-inject tags
    const tags = emotionCache.sheet.tags;
    emotionCache.sheet.flush();
    tags.forEach((tag) => {
      // eslint-disable-next-line no-underscore-dangle
      (emotionCache.sheet as any)._insertTag(tag);
    });
    // reset cache to reapply global styles
    clientStyleData.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`,
          }}
        />
        <Scripts />
        <LiveReload />
        <RemixDevTools />
      </body>
    </html>
  );
});

export default withSentry(App);
