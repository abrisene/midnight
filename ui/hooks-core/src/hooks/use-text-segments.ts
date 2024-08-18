/* -------------------------------------------------------------------------------------------------
 * TYPES
 * -----------------------------------------------------------------------------------------------*/

import { useMemo } from "react";

import type {
  ExtractTextSegmentsOptions,
  TextSegment,
} from "../utils/text-segments";

import { extractTextSegments } from "../utils/text-segments";

/* -------------------------------------------------------------------------------------------------
 * HOOKS
 * -----------------------------------------------------------------------------------------------*/

export function useTextSegments({
  text,
  keywords,
  classNames,
  baseClassName,
}: ExtractTextSegmentsOptions): TextSegment[] {
  return useMemo(
    () =>
      extractTextSegments({
        text,
        keywords,
        classNames,
        baseClassName,
      }),
    [text, keywords, classNames, baseClassName],
  );
}
