import type { Preview } from "@storybook/react";
import { themes } from "@storybook/theming";

import "../src/globals.css";

import { withThemeByClassName } from "@storybook/addon-themes";

const preview: Preview = {
  parameters: {
    darkMode: {
      classTarget: "html",
      darkClass: "dark bg-background",
      lightClass: "light",
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      theme: themes.dark,
      // container: ({ children }) => (
      //   <div className="text-red-500">{children}</div>
      // ),
      // components: {
      //   pre: ({ children }) => <div className="text-red-500">{children}</div>,
      // },
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: "light",
        dark: "dark",
      },
      defaultTheme: "dark",
    }),
  ],
};

export default preview;
