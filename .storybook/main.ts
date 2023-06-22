import * as path from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import * as styles from "../app/styles/theme";

const config = {
  stories: [
    "../app/components/**/*.stories.mdx",
    "../app/components/**/*.stories.@(ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "storybook-addon-react-router-v6",
    "storybook-addon-mock",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  viteFinal: async (config) => {
    config.plugins.push(
      tsconfigPaths({
        projects: [path.resolve(path.dirname(__dirname), "tsconfig.json")],
      })
    );

    return config;
  },
};

export default config;
