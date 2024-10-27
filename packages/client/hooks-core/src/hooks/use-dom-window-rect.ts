import { useMemo } from "react";

import { getWindowClientRect } from "../utils/utils-rect";

export function useWindowRect(element: typeof window | null) {
  return useMemo(
    () => (element ? getWindowClientRect(element) : null),
    [element],
  );
}
