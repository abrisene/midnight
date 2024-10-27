"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* -------------------------------------------------------------------------------------------------
 * MANTINE
 * -----------------------------------------------------------------------------------------------*/

/* -------------------------------------------------------------------------------------------------
 * HOOKS
 * -----------------------------------------------------------------------------------------------*/

/**
 * Debounces a state value with a cooldown period.
 * @param defaultValue The default state value.
 * @param wait The debounce period.
 * @param options The debounce options.
 * @returns The debounced state value and setter.
 */
export function useDebouncedState<T = unknown>(
  defaultValue: T,
  wait: number,
  options = { leading: false },
) {
  const [value, setValue] = useState(defaultValue);
  const timeoutRef = useRef<number | null>(null);
  const leadingRef = useRef(true);

  const clearTimeout = () => window.clearTimeout(timeoutRef.current!);
  useEffect(() => clearTimeout, []);

  const debouncedSetValue = useCallback(
    (newValue: T) => {
      clearTimeout();
      if (leadingRef.current && options.leading) {
        setValue(newValue);
      } else {
        timeoutRef.current = window.setTimeout(() => {
          leadingRef.current = true;
          setValue(newValue);
        }, wait);
      }
      leadingRef.current = false;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [options.leading],
  );

  return [value, debouncedSetValue] as const;
}
