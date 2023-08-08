import React from "react";
import type { Preview } from "@storybook/react";
import { CssBaseline } from "@mui/material";
import { withRouter } from "storybook-addon-react-router-v6";
import { ThemeProvider } from "../app/styles/ThemeContext";

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
      <ThemeProvider>
        <CssBaseline />
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default preview;
