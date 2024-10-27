/* -------------------------------------------------------------------------------------------------
 * TYPES
 * -----------------------------------------------------------------------------------------------*/

export interface HighlighterChunk {
  chunk: string;
  highlighted: boolean;
}

/* -------------------------------------------------------------------------------------------------
 * [INTERNAL] UTILITIES
 * -----------------------------------------------------------------------------------------------*/

function escapeRegex(value: string) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#]/g, "\\$&");
}

/* -------------------------------------------------------------------------------------------------
 * UTILITIES
 * -----------------------------------------------------------------------------------------------*/

/**
 * Breaks a string into chunks, highlighting the given keys.
 * @param value The string to break into chunks.
 * @param keys The keys to highlight.
 * @returns An array of chunks.
 */
export function highlighter(
  value: string,
  keys: string | string[] | null,
): HighlighterChunk[] {
  if (keys == null) {
    return [{ chunk: value, highlighted: false }];
  }

  const highlight = Array.isArray(keys)
    ? keys.map(escapeRegex)
    : escapeRegex(keys);

  const shouldHighlight = Array.isArray(highlight)
    ? highlight.filter((part) => part.trim().length > 0).length > 0
    : highlight.trim() !== "";

  if (!shouldHighlight) {
    return [{ chunk: value, highlighted: false }];
  }

  const matcher =
    typeof highlight === "string"
      ? highlight.trim()
      : highlight
          .filter((part) => part.trim().length !== 0)
          .map((part) => part.trim())
          .sort((a, b) => b.length - a.length)
          .join("|");

  const re = new RegExp(`(${matcher})`, "gi");
  const chunks = value
    .split(re)
    .map((part) => ({ chunk: part, highlighted: re.test(part) }))
    .filter(({ chunk }) => chunk);

  return chunks;
}
