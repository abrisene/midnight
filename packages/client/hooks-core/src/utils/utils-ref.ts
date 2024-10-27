import type { Ref } from "react";

import { getAspectRatio } from "./utils-aspect-ratio";

export type PossibleRef<T> = Ref<T> | undefined;

/* -------------------------------------------------------------------------------------------------
 * REF UTILS
 * -----------------------------------------------------------------------------------------------*/

export function assignRef<T>(ref: PossibleRef<T>, value: T) {
  if (typeof ref === "function") {
    ref(value);
  } else if (typeof ref === "object" && ref !== null && "current" in ref) {
    (ref as React.MutableRefObject<T>).current = value;
  }
}

export function mergeRefs<T>(...refs: PossibleRef<T>[]) {
  return (node: T | null) => {
    refs.forEach((ref) => assignRef(ref, node));
  };
}

/* -------------------------------------------------------------------------------------------------
 * REF SIZING
 * -----------------------------------------------------------------------------------------------*/

export function getRefDimensions(ref: React.RefObject<HTMLDivElement>) {
  if (!ref.current) return { width: 0, height: 0 };
  return { width: ref.current.offsetWidth, height: ref.current.offsetHeight };
}

export function getRefAspectRatio(ref: React.RefObject<HTMLDivElement>) {
  const { width, height } = getRefDimensions(ref);
  return getAspectRatio(width, height);
}
