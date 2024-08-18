"use client";

import { useEffect, useRef, useState } from "react";

/* -------------------------------------------------------------------------------------------------
 * HOOKS
 * -----------------------------------------------------------------------------------------------*/

/**
 *
 * @param value
 * @param wait
 * @param options
 * @returns
 */
export function useDebouncedValue<T = unknown>(
  value: T,
  wait: number,
  options = { leading: false },
) {
  const [_value, setValue] = useState(value);
  const mountedRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);
  const cooldownRef = useRef(false);

  const cancel = () => window.clearTimeout(timeoutRef.current!);

  useEffect(() => {
    if (mountedRef.current) {
      if (!cooldownRef.current && options.leading) {
        cooldownRef.current = true;
        setValue(value);
      } else {
        cancel();
        timeoutRef.current = window.setTimeout(() => {
          cooldownRef.current = false;
          setValue(value);
        }, wait);
      }
    }
  }, [value, options.leading, wait]);

  useEffect(() => {
    mountedRef.current = true;
    return cancel;
  }, []);

  return [_value, cancel] as const;
}
