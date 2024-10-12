import { useReducer } from "react";
import { useIsomorphicLayoutEffect } from "@dnd-kit/utilities";

import { getClientRect } from "../utils/rect/get-rect";
import { useMutationObserver } from "./use-mutation-observer";
import { useResizeObserver } from "./use-resize-observer";

function defaultMeasure(element: HTMLElement) {
  return new Rect(getClientRect(element), element);
}

export function useRect(
  element: HTMLElement | null,
  measure: (element: HTMLElement) => DOMRect = defaultMeasure,
  fallbackRect?: DOMRect | null,
) {
  const [rect, measureRect] = useReducer(reducer, null);

  const mutationObserver = useMutationObserver({
    callback(records) {
      if (!element) {
        return;
      }

      for (const record of records) {
        const { type, target } = record;

        if (
          type === "childList" &&
          target instanceof HTMLElement &&
          target.contains(element)
        ) {
          measureRect();
          break;
        }
      }
    },
  });
  const resizeObserver = useResizeObserver({ callback: measureRect });

  useIsomorphicLayoutEffect(() => {
    measureRect();

    if (element) {
      resizeObserver?.observe(element);
      mutationObserver?.observe(document.body, {
        childList: true,
        subtree: true,
      });
    } else {
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
    }
  }, [element]);

  return rect;

  function reducer(currentRect: ClientRect | null) {
    if (!element) {
      return null;
    }

    if (element.isConnected === false) {
      // Fall back to last rect we measured if the element is
      // no longer connected to the DOM.
      return currentRect ?? fallbackRect ?? null;
    }

    const newRect = measure(element);

    if (JSON.stringify(currentRect) === JSON.stringify(newRect)) {
      return currentRect;
    }

    return newRect;
  }
}
