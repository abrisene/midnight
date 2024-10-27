import mdx from "@mdx-js/rollup";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  envPrefix: "PUBLIC_",
  envDir: "../../../",
  plugins: [react(), TanStackRouterVite(), mdx()],
});
