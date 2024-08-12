import path from "path";
import mdx from "@mdx-js/rollup";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import baseConfig from "./base.js";

export default defineConfig({
  ...baseConfig,
  // envPrefix: "PUBLIC_",
  // envDir: "../../../",
  // server: {
  //   port: 5180,
  //   host: "0.0.0.0",
  // },
  plugins: [react(), TanStackRouterVite(), mdx()],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
      "~ui": path.resolve(__dirname, "./src/components"),
      "~lib": path.resolve(__dirname, "./src/lib"),
      "~hooks": path.resolve(__dirname, "./src/hooks"),
      "~utils": path.resolve(__dirname, "./src/utils"),
      "~db": path.resolve(__dirname, "./src/db"),
      "~state": path.resolve(__dirname, "./src/state"),
      "~variants": path.resolve(__dirname, "./src/variants"),
      "~assets": path.resolve(__dirname, "./src/assets"),
    },
  },
});
