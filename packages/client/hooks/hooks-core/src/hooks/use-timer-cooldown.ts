"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* -------------------------------------------------------------------------------------------------
 * HOOKS
 * -----------------------------------------------------------------------------------------------*/

/**
 * A hook that provides a cooldown which triggers a callback after a specified delay.
 * @param fn The callback function to invoke.
 * @param delay The cooldown period.
 * @param autoInvoke Whether to automatically invoke the callback on mount or not.
 * @returns The cooldown state and control functions.
 */
export function useCooldown(
  fn: (...args: unknown[]) => unknown = () => null,
  delay = 20,
  autoInvoke = false,
) {
  const [cooldown, setCooldown] = useState(delay);
  const [active, setActive] = useState(autoInvoke);
  const timeoutRef = useRef<number>();

  const start = useCallback(() => {
    setActive(true);
  }, []);

  const clear = useCallback(() => {
    setActive(false);
    clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    if (active) {
      timeoutRef.current = window.setTimeout(() => {
        fn();
        setActive(false);
      }, cooldown);
    }

    return () => clearTimeout(timeoutRef.current);
  }, [active, cooldown, fn]);

  return { start, clear, active, set: setCooldown };
}

/**
 * Debounces a callback function with a cooldown period.
 * @param callback The callback function to debounce.
 * @param delay The debounce period.
 * @param cooldown The cooldown period.
 * @returns The debounced callback function.
 */
export function useDebounceWithCooldown(
  callback: () => void,
  delay: number,
  cooldown: number,
) {
  const [lastCall, setLastCall] = useState<number>(0);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(() => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;

    if (timerId) {
      clearTimeout(timerId);
    }

    // If cooldown period has elapsed, execute the callback immediately.
    if (timeSinceLastCall >= cooldown) {
      callback();
      setLastCall(now);
      return;
    }

    const timer = setTimeout(() => {
      callback();
      setLastCall(now);
    }, delay);

    setTimerId(timer);
  }, [callback, delay, cooldown, timerId, lastCall]);

  useEffect(() => {
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [timerId]);

  return debouncedCallback;
}

export default useDebounceWithCooldown;
