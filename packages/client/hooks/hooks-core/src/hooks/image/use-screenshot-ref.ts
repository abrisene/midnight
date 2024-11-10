"use client";

import { useCallback } from "react";

import type { ScreenshotOptions } from "./use-screenshot";

import { useScreenshot } from "./use-screenshot";

/* -------------------------------------------------------------------------------------------------
 * TYPES
 * -----------------------------------------------------------------------------------------------*/

export interface ScreenshotRefOptions<T> extends ScreenshotOptions {
  ref?: React.RefObject<T>;
}

/* -------------------------------------------------------------------------------------------------
 * HOOKS
 * -----------------------------------------------------------------------------------------------*/

export function useScreenshotRef<T extends HTMLElement>({
  ref,
  ...options
}: ScreenshotRefOptions<T>) {
  const { takeScreenshot, ...rest } = useScreenshot(options);
  const takeScreenshotRef = useCallback(() => {
    if (!ref?.current) return;
    return takeScreenshot(ref.current);
  }, [ref, takeScreenshot]);
  return { takeScreenshot: takeScreenshotRef, ...rest };
}
