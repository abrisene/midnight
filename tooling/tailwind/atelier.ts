import type { Config } from "tailwindcss";
import container from "@tailwindcss/container-queries";
import fluid, { extract, fontSize, screens } from "fluid-tailwind";
import tailwind3d from "tailwindcss-3d";
// import { lerpColors } from "tailwind-lerp-colors";
import signals from "tailwindcss-signals";

import { customBackgrounds, customColorVariables } from "./plugins/custom";

// import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: { files: ["./src/**/*.{ts,tsx,mdx}"], extract },
  presets: [],
  plugins: [
    container,
    fluid,
    signals,
    tailwind3d,
    customBackgrounds,
    customColorVariables,
  ],
  theme: {
    screens,
    fontSize,
    extend: {
      fontSize: {
        "3xs": "0.5rem",
        "2xs": "0.625rem",
        xs: "0.75rem",
      },
      colors: {
        workspace: {
          DEFAULT: "hsl(var(--workspace) / <alpha-value>)",
          foreground: "hsl(var(--workspace-foreground) / <alpha-value>)",
        },
      },
      height: {
        screen: "100svh",
      },
      aspectRatio: {
        "35mm": "3 / 2",
        instax: "2 / 3",
        tarot: "2 / 3",
        landscape: "4 / 3",
        portrait: "3 / 4",
        // "card-standard": "64 / 89",
        // "card-large": "2.3 / 3.5",
        // "card-bridge": "37 / 89",
        // cardtarot: "2 / 4",
      },
      transitionProperty: {
        width: "width",
        height: "height",
        size: "width, height",
        spacing: "margin, padding",
      },
      dropShadow: {
        glow: [
          "0 0px 20px rgba(255,255, 255, 0.35) / <alpha-value>",
          "0 0px 65px rgba(255, 255,255, 0.2) / <alpha-value>",
        ],
        // glow: [
        //   "0 0px 20px rgba(255,255, 255, 0.35)",
        //   "0 0px 65px rgba(255, 255,255, 0.2)",
        // ],
      },
      brightness: {
        theme0: "var(--brightness-theme)",
        theme50: "var(--brightness-theme-0.5)",
        theme75: "var(--brightness-theme-0.75)",
        theme90: "var(--brightness-theme-0.9)",
        theme100: "var(--brightness-theme-1)",
        theme105: "var(--brightness-theme-1.1)",
        theme110: "var(--brightness-theme-1.2)",
        theme125: "var(--brightness-theme-1.25)",
        theme150: "var(--brightness-theme-1.5)",
        theme200: "var(--brightness-theme-2)",
      },
      strokeWidth: {
        "0.25": "0.25",
        "0.5": "0.5",
        "3": "3",
        "4": "4",
        "5": "5",
        "6": "6",
        "7": "7",
        "8": "8",
        "9": "9",
        "10": "10",
        "20": "20",
      },
      animation: {
        marquee: "marquee var(--duration, 30s) linear infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
        burns: "burns-pan var(--duration, 30s) infinite alternate ease-in",
        "burns-pan":
          "burns-pan var(--duration, 30s) infinite alternate ease-in",
        "burns-pan-up":
          "burns-pan-up var(--duration, 30s) infinite alternate ease-in",
        "burns-pan-down":
          "burns-pan-down var(--duration, 30s) infinite alternate ease-in",
      },
      keyframes: {
        marquee: {
          to: { transform: "translateX(-50%)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        "burns-pan": {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "100% 0%" },
          /* "0%": { opacity: "1" },
          "5%": { opacity: "0" },
          "95%": {
            transform: "scale3d(1.5, 1.5, 1.5), translate3d(0, -500px, 0)",
            opacity: "1",
          },
          "100%": {
            transform: "scale3d(2, 2, 2), translate3d(0, -525px, 0)",
            opacity: "0",
          }, */
        },
        "burns-pan-down": {
          "0%": {
            backgroundPosition: "top",
            transform: "translate3d(0, -50%, 0) scale3d(2, 2, 1)",
          },
          "100%": {
            backgroundPosition: "bottom",
            transform: "translate3d(0, 0, 0) scale3d(1, 1, 1)",
          },
        },
      },
    },
  },
} satisfies Config;
