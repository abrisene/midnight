import json5 from "json5";

import { fixJson } from "../fix/fix-json";

/* -------------------------------------------------------------------------------------------------
 * parse-partial-json.ts
 * -----------------------------------------------------------------------------------------------*/

/**
 * Attempts to parse a partial JSON string using json5.
 * @param text - The partial JSON string to parse.
 * @returns The parsed JSON object or undefined if the string is not valid JSON.
 */
export function parsePartialJson5<T = unknown>(
  text: string | undefined,
): T | undefined {
  if (text == null) {
    return undefined;
  }

  try {
    // first attempt a regular JSON parse:
    return json5.parse(text);
  } catch (ignored) {
    try {
      // then try to fix the partial JSON and parse it:
      const fixedJsonText = fixJson(text);
      return json5.parse(fixedJsonText);
    } catch (ignored) {
      // ignored
    }
  }

  return undefined;
}
