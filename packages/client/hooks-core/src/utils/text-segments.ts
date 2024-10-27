import type { HighlighterChunk } from "./text-highlight";

import { highlighter } from "./text-highlight";

/* -------------------------------------------------------------------------------------------------
 * COMMON TYPES
 * -----------------------------------------------------------------------------------------------*/

export interface TextKeyword {
  text: string;
  key?: string;
  className?: string;
}

export type TextKeywordList = string[] | TextKeyword[];

export interface TextSegment extends HighlighterChunk {
  // chunk: string;
  // highlighted: boolean;
  className?: string;
}

/* -------------------------------------------------------------------------------------------------
 * OPTIONS
 * -----------------------------------------------------------------------------------------------*/

export interface MapKeywordsOptions {
  keywords?: TextKeywordList;
  classNames?: string | string[];
  baseClassName?: string;
}

export interface ExtractTextSegmentsOptions extends MapKeywordsOptions {
  text?: string;
  // keywords?: TextKeywordList;
  // classNames?: string | string[];
  // baseClassName?: string;
}

/* -------------------------------------------------------------------------------------------------
 * UTILS
 * -----------------------------------------------------------------------------------------------*/

/* -------------------------------------------------------------------------------------------------
 * MAP KEYS TO CLASSNAMES
 */

/**
 * Maps an array of classNames to an array of keywords, rotating through the classNames.
 * @param options.keywords An array of keywords to map to classNames.
 * @param options.classNames An array of classNames to rotate through for each keyword.
 * @param options.baseClassName A base class name to use for all keywords.
 * @returns
 */
export function mapKeysToClassNames({
  keywords,
  classNames,
  baseClassName,
}: MapKeywordsOptions): Record<string, string> {
  if (!keywords || (!classNames && !baseClassName)) return {};
  const baseClass = baseClassName ? `${baseClassName} ` : "";
  const classList = Array.isArray(classNames) ? classNames : [classNames];
  let iter = 0;
  const keywordMap = keywords.reduce(
    (acc, n) => {
      // Extract the key.
      const key = typeof n === "string" ? n : n.text;
      if (typeof n === "object" && n.className) {
        // If the keyword has a class name, use it
        acc[n.text] = `${baseClass}${n.className}`;
      } else {
        // If we don't have a classList, only use the base class.
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!classList) {
          acc[key] = baseClass;
          return acc;
        }
        // Otherwise use the classNames and iterate
        acc[key] = `${baseClass}${classList[iter] ?? "X"}`;
        iter = (iter + 1) % classList.length;
      }
      return acc;
    },
    {} as Record<string, string>,
  );

  return keywordMap;
}

/* -------------------------------------------------------------------------------------------------
 * EXTRACT TEXT SEGMENTS
 */

/**
 * Extracts the text segments from a string, highlighting the keywords with the provided classNames.
 * @param options.text The text to extract segments from.
 * @param options.keywords An array of keywords to highlight.
 * @param options.classNames An array of classNames to rotate through for each keyword.
 * @param options.baseClassName A base class name to use for all keywords.
 * @returns
 */
export function extractTextSegments({
  text,
  keywords,
  classNames,
  baseClassName,
}: {
  text?: string;
  keywords?: TextKeywordList;
  classNames?: string | string[];
  baseClassName?: string;
}): TextSegment[] {
  // If we don't have any text or keywords, just return the text as a single segment.
  if (!text || text.length === 0) return [];
  if (!keywords || keywords.length === 0)
    return [{ chunk: text, highlighted: false, className: undefined }];

  // Otherwise get the keyword map and the chunks.
  const keywordMap = mapKeysToClassNames({
    keywords,
    classNames,
    baseClassName,
  });

  const chunks = highlighter(text, Object.keys(keywordMap));

  // And then map the text to the keyword map.
  const segments: TextSegment[] = chunks.map((chunk) => {
    if (!chunk.highlighted) return chunk;
    const res = {
      chunk: chunk.chunk,
      highlighted: chunk.highlighted,
      className: keywordMap[chunk.chunk],
    };
    return res;
  });

  return segments;
}
