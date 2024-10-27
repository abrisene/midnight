import storybookConfig from "eslint-plugin-storybook";

import baseConfig from "@configs/eslint-config/base";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ["dist/**"],
  },
  ...baseConfig,
  storybookConfig.recommended,
];
