"use client";

import { useCallback, useEffect, useState } from "react";

/* -------------------------------------------------------------------------------------------------
 * HOOKS
 * -----------------------------------------------------------------------------------------------*/

/**
 * Returns the aspect ratio of the given element.
 * @param ref The element to observe.
 * @returns The aspect ratio of the element.
 */
export const useAspectRatio = (ref: React.RefObject<HTMLDivElement> | null) => {
  const [aspectRatio, setAspectRatio] = useState(0);

  const updateAspectRatio = useCallback(() => {
    if (ref?.current) {
      const width = ref.current.offsetWidth;
      const height = ref.current.offsetHeight;
      setAspectRatio(width / height);
    }
  }, [ref]);

  useEffect(() => {
    if (!ref?.current) return;

    const observer = new ResizeObserver(updateAspectRatio);
    observer.observe(ref.current);

    // Initial update
    updateAspectRatio();

    return () => observer.disconnect();
  }, [ref, updateAspectRatio]);

  return aspectRatio;
};
