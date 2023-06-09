import * as path from "path";
import tsconfigPaths from "vite-tsconfig-paths";

const config = {
  stories: [
    "../app/components/**/*.stories.mdx",
    "../app/components/**/*.stories.@(ts|tsx)",
  ],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
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
