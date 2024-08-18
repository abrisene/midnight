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
      // "../../ui/atelier-core/**/*.{ts,tsx}",
      // "../../ui/atelier-graph/**/*.{ts,tsx}",
      // "../../packages/client/ui/atelier-textgen/**/*.{ts,tsx}",
      // "../../packages/client/ui/atelier-imagegen/**/*.{ts,tsx}",
      // "../../packages/client/ui/atelier-viz/**/*.{ts,tsx}",
      // "../../../ui/providers/trpc/**/*.{ts,tsx}",
      // "../../../ui/providers/surreal/**/*.{ts,tsx}",
      // "../../../ui/providers/worker/**/*.{ts,tsx}",
      // "../../../ui/atelier/core/**/*.{ts,tsx}",
      // "../../../ui/atelier/chat/**/*.{ts,tsx}",
      // "../../../ui/atelier/graph/**/*.{ts,tsx}",
      // "../../../ui/atelier/gen-audio/**/*.{ts,tsx}",
      // "../../../ui/atelier/gen-text/**/*.{ts,tsx}",
      // "../../../ui/atelier/gen-image/**/*.{ts,tsx}",
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
