"use client";

import type { RefObject } from "react";
import { useState } from "react";

import { useMousePosition } from "./use-mouse-position";

/* -------------------------------------------------------------------------------------------------
 * TYPES
 * -----------------------------------------------------------------------------------------------*/

export interface UseMouseParallaxProps {
  ref?: RefObject<HTMLElement> | null;
  depth?: number;
  rotationStrength?: number;
  invert?: boolean;
  whileHover?: boolean;
}

/* -------------------------------------------------------------------------------------------------
 * HOOKS
 * -----------------------------------------------------------------------------------------------*/

/* -------------------------------------------------------------------------------------------------
 * useMouseParallax
 */

/**
 * Creates a parallax effect based on the mouse position.
 * @options.ref The ref to use for the mouse position. If not provided, the window will be used.
 * @options.depth The depth of the parallax effect. Defaults to 10.
 * @options.rotationStrength The strength of the rotation. Defaults to 1.
 * @options.invert Whether to invert the parallax effect. Defaults to false.
 */
export function useMouseParallax({
  ref,
  depth: initialDepth = 10,
  rotationStrength: initialRotationStrength = 0,
  invert = false,
  whileHover = true,
}: UseMouseParallaxProps) {
  const [transform, setTransform] = useState({
    translate: { x: 0, y: 0 },
    rotate: { x: 0, y: 0 },
  });
  const depth = initialDepth === 0 ? 1 : initialDepth;
  const rotationStrength =
    initialRotationStrength === 0 ? 1 : initialRotationStrength;

  const { position: pos, hovering } = useMousePosition({
    ref,
    onMove: (pos) =>
      setTransform({
        translate: invert
          ? { x: -pos.x * depth, y: pos.y * depth }
          : { x: pos.x * depth, y: -pos.y * depth },
        rotate: invert
          ? {
              x: pos.x * (rotationStrength / depth),
              y: -pos.y * (rotationStrength / depth),
            }
          : {
              x: -pos.x * (rotationStrength / depth),
              y: pos.y * (rotationStrength / depth),
            },
      }),
  });

  const applyStyle = whileHover ? hovering : true;

  // Create the style taking into account the depth (xy translation) and rotation strength (z rotation)
  const style = applyStyle
    ? {
        transform: `translate(${transform.translate.x}px, ${transform.translate.y}px) rotateX(${transform.rotate.x}deg) rotateY(${transform.rotate.y}deg)`,
      }
    : {};

  return { style, mousePosition: pos, transform };
}
