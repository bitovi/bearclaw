import React from "react";
import type { Preview } from "@storybook/react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "../app/styles/theme";
import { withRouter } from "storybook-addon-react-router-v6";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    withRouter,
    (Story) => (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default preview;
