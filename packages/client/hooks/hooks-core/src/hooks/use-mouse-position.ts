"use client";

import type { RefObject } from "react";
import { useEffect, useState } from "react";

/* -------------------------------------------------------------------------------------------------
 * TYPES
 * -----------------------------------------------------------------------------------------------*/

interface UseMousePositionProps {
  ref?: RefObject<HTMLElement> | null;
  onMove?: (pos: { x: number; y: number }) => void;
}

/* -------------------------------------------------------------------------------------------------
 * HOOKS
 * -----------------------------------------------------------------------------------------------*/

/* -------------------------------------------------------------------------------------------------
 * useMousePosition
 */

/**
 * Returns the mouse position relative to the window or a ref.
 * @options.ref The ref to use for the mouse position. If not provided, the window will be used.
 * @options.onMove A callback function that will be called when the mouse moves.
 * @returns A Vec2dObject representing the mouse position.
 */
export function useMousePosition({ ref, onMove }: UseMousePositionProps = {}) {
  const [hovered, setHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    // Create the mouse enter / leave handlers.
    const handleMouseEnter = () => setHovered(true);
    const handleMouseLeave = () => setHovered(false);
    // Create the mouse position handler.
    const handleMouseMove = (event: MouseEvent) => {
      const newPos = mousePosition;
      if (ref?.current) {
        // If the ref exists, use it to get the mouse position relative to the element
        const rect = ref.current.getBoundingClientRect();
        newPos.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        newPos.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      } else {
        // Otherwise, use the window to get the mouse position relative to the window
        newPos.x = (event.clientX / window.innerWidth) * 2 - 1;
        newPos.y = -(event.clientY / window.innerHeight) * 2 + 1;
        // x: event.clientX / window.innerWidth - 0.5,
        // y: event.clientY / window.innerHeight - 0.5,
      }
      setMousePosition(newPos);
      onMove?.(newPos);
    };

    // Add event listener to the ref if it exists, otherwise add it to the window
    if (ref?.current) {
      ref.current.addEventListener("mousemove", handleMouseMove);
      ref.current.addEventListener("mouseenter", handleMouseEnter);
      ref.current.addEventListener("mouseleave", handleMouseLeave);
    } else {
      window.addEventListener("mousemove", handleMouseMove);
      if (!hovered) setHovered(true);
    }

    // Remove event listener when the component unmounts
    return () => {
      if (ref?.current) {
        ref.current.removeEventListener("mousemove", handleMouseMove);
        ref.current.removeEventListener("mouseenter", handleMouseEnter);
        ref.current.removeEventListener("mouseleave", handleMouseLeave);
      } else {
        window.removeEventListener("mousemove", handleMouseMove);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  return { position: mousePosition, hovering: hovered };
}
