"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* -------------------------------------------------------------------------------------------------
 * HOOKS
 * -----------------------------------------------------------------------------------------------*/

/**
 * A hook that returns a ref and a boolean indicating if the element is hovered.
 * @returns
 */
export function useHover<T extends HTMLElement = HTMLDivElement>() {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<T>(null);
  const onMouseEnter = useCallback(() => setHovered(true), []);
  const onMouseLeave = useCallback(() => setHovered(false), []);

  useEffect(() => {
    const current = ref.current;
    if (current) {
      current.addEventListener("mouseenter", onMouseEnter);
      current.addEventListener("mouseleave", onMouseLeave);

      return () => {
        current.removeEventListener("mouseenter", onMouseEnter);
        current.removeEventListener("mouseleave", onMouseLeave);
      };
    }

    return undefined;
  }, []);

  return { ref, hovered };
}
