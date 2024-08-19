import { default as svgToDataUri } from "mini-svg-data-uri";
//@ts-ignore
import { default as flattenColorPalette } from "tailwindcss/lib/util/flattenColorPalette";

export function customBackgrounds({
  matchUtilities,
  theme,
  addUtilities,
}: any) {
  matchUtilities(
    {
      // Dots
      dots: (value: any) => ({
        backgroundImage: `url("${svgToDataUri(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`,
        )}")`,
      }),
      // Grid
      "bg-grid": (value: any) => ({
        backgroundImage: `url("${svgToDataUri(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`,
        )}")`,
      }),
    },

    { values: flattenColorPalette(theme("backgroundColor")), type: "color" },
  );
}

export function customColorVariables({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val]),
  );

  addBase({
    ":root": newVars,
  });
}
