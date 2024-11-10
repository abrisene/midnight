"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* -------------------------------------------------------------------------------------------------
 * TYPES
 * -----------------------------------------------------------------------------------------------*/

export interface UseFocusWithinOptions {
  onFocus?(event: FocusEvent): void;
  onBlur?(event: FocusEvent): void;
}

/* -------------------------------------------------------------------------------------------------
 * UTILS (Internal)
 * -----------------------------------------------------------------------------------------------*/

/**
 * Checks if the related target is contained within the current target.
 * @param event The focus event.
 * @returns true if the related target is contained within the current target.
 */
function containsRelatedTarget(event: FocusEvent) {
  if (
    event.currentTarget instanceof HTMLElement &&
    event.relatedTarget instanceof HTMLElement
  ) {
    return event.currentTarget.contains(event.relatedTarget);
  }

  return false;
}

/* -------------------------------------------------------------------------------------------------
 * HOOKS
 * -----------------------------------------------------------------------------------------------*/

/**
 * Hook that tracks focus within a given element.
 * @param
 * @returns
 */
export function useFocusWithin<T extends HTMLElement = HTMLElement>({
  onBlur,
  onFocus,
}: UseFocusWithinOptions = {}): {
  ref: React.MutableRefObject<T | null>;
  focused: boolean;
} {
  const ref = useRef<T | null>(null);
  const [focused, setFocused] = useState(false);

  const handleFocusIn = useCallback(
    (event: FocusEvent) => {
      if (!focused) {
        setFocused(true);
        onFocus?.(event);
      }
    },
    [focused, onFocus],
  );

  const handleFocusOut = useCallback(
    (event: FocusEvent) => {
      if (focused && !containsRelatedTarget(event)) {
        setFocused(false);
        onBlur?.(event);
      }
    },
    [focused, onBlur],
  );

  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener("focusin", handleFocusIn);
      ref.current.addEventListener("focusout", handleFocusOut);

      return () => {
        ref.current?.removeEventListener("focusin", handleFocusIn);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        ref.current?.removeEventListener("focusout", handleFocusOut);
      };
    }

    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, onFocus, onBlur]);

  return { ref, focused };
}
