/* -------------------------------------------------------------------------------------------------
 * parse-partial-json.ts
 * -----------------------------------------------------------------------------------------------*/

import SecureJSON from "secure-json-parse";

import { fixJson } from "../fix/fix-json";

export function parsePartialJson<T = unknown>(
  text: string | undefined,
): T | undefined {
  if (text == null) {
    return undefined;
  }

  try {
    // first attempt a regular JSON parse:
    return SecureJSON.parse(text);
  } catch (ignored) {
    try {
      // then try to fix the partial JSON and parse it:
      const fixedJsonText = fixJson(text);
      return SecureJSON.parse(fixedJsonText);
    } catch (ignored) {
      // ignored
    }
  }

  return undefined;
}
