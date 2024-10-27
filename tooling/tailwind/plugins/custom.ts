import { default as svgToDataUri } from "mini-svg-data-uri";
//@ts-expect-error - flattenColorPalette is not typed
import { default as flattenColorPalette } from "tailwindcss/lib/util/flattenColorPalette";

export function customBackgrounds({
  matchUtilities,
  theme,
  _addUtilities,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  matchUtilities(
    {
      // Dots
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dots: (value: any) => ({
        backgroundImage: `url("${svgToDataUri(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`,
        )}")`,
      }),
      // Grid
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      "bg-grid": (value: any) => ({
        backgroundImage: `url("${svgToDataUri(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`,
        )}")`,
      }),
    },

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    { values: flattenColorPalette(theme("backgroundColor")), type: "color" },
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function customColorVariables({ addBase, theme }: any) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const allColors = flattenColorPalette(theme("colors"));
  const newVars = Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val]),
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  addBase({
    ":root": newVars,
  });
}
