"use client";

import type { Ref } from "react";
import { useCallback } from "react";

import type { PossibleRef } from "../utils/utils-ref";

import { mergeRefs } from "../utils/utils-ref";

export function useMergedRef<T>(...refs: PossibleRef<T>[]) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(mergeRefs(...refs), refs);
}
