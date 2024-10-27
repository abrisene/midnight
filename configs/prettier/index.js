import { fileURLToPath } from "url";

/** @typedef {import("prettier").Config} PrettierConfig */
/** @typedef {import("prettier-plugin-tailwindcss").PluginOptions} TailwindConfig */
/** @typedef {import("@ianvs/prettier-plugin-sort-imports").PluginConfig} SortImportsConfig */

/** @type { PrettierConfig | SortImportsConfig | TailwindConfig } */
const config = {
  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  tailwindConfig: fileURLToPath(
    new URL("../../tooling/tailwind/web.ts", import.meta.url),
  ),
  tailwindFunctions: ["cn", "cva"],
  importOrder: [
    "<TYPES>",
    "^(react/(.*)$)|^(react$)|^(react-native(.*)$)",
    "^(next/(.*)$)|^(next$)",
    "^(expo(.*)$)|^(expo$)",
    "<THIRD_PARTY_MODULES>",
    "",
    "",
    "<TYPES>^@repo",
    "^@schemas",
    "^@configs",
    "",
    "^@db",
    "",
    "<TYPES>^[.|..|~]",
    "^~/",
    "^~utils",
    "^~db",
    "^~lib",
    "",
    "^~state",
    "",
    "^@atelier/hooks",
    "^~hooks",
    "",
    "^@atelier",
    "^~ui",
    "^~variants",
    "",
    "^[../]",
    "^[./]",
    "",
    "^~assets",
  ],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderTypeScriptVersion: "4.4.0",
  overrides: [
    {
      files: "*.json.hbs",
      options: {
        parser: "json",
      },
    },
    {
      files: "*.js.hbs",
      options: {
        parser: "babel",
      },
    },
    {
      files: "*.css",
      options: {
        parser: "css",
      },
    },
  ],
};

export default config;