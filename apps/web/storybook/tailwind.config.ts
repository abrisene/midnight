import type { Config } from "tailwindcss";

// import { fontFamily } from "tailwindcss/defaultTheme";

import baseConfig from "@configs/tailwind-config/web";

export default {
  // We need to append the path to the UI package to the content array so that
  // those classes are included correctly.
  content: {
    files: [
      ...baseConfig.content.files,
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
      "../../ui/ui-core/src/**/*.{ts,tsx}",
      // "../../ui/hooks-core/src/**/*.{ts,tsx}",
      "../../packages/ui/atelier-admin/src/**/*.{ts,tsx}",
      "../../packages/ui/atelier-json/src/**/*.{ts,tsx}",
      "../../packages/ui/atelier-llm/src/**/*.{ts,tsx}",
      "../../packages/ui/atelier-viz/src/**/*.{ts,tsx}",
      // "../../packages/ui/atelier-core/src/**/*.{ts,tsx}",
    ],
    extract: baseConfig.content.extract,
  },
  presets: [baseConfig],
  theme: {
    // extend: {
    //   fontFamily: {
    //     sans: ["var(--font-geist-sans)", ...fontFamily.sans],
    //     mono: ["var(--font-geist-mono)", ...fontFamily.mono],
    //   },
    // },
  },
} satisfies Config;
