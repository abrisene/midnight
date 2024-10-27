import type { MouseEvent} from "react";
import { useCallback, useRef, useState } from "react";

/**
 * useContextualData Hook
 *
 * This custom React hook provides a system for capturing, storing, and managing
 * contextual data based on user interactions with components.
 *
 * Functionality:
 * 1. Captures data from hovered or interacted elements.
 * 2. Maintains a history of unique interactions.
 * 3. Implements a hover threshold to avoid recording brief, unintentional hovers.
 * 4. Prevents duplicate entries in the interaction history.
 * 5. Stores detailed information about each interaction, including type and timestamp.
 *
 * @param {Object} initialData - The initial state of the contextual data.
 * @param {number} maxHistoryLength - Maximum number of entries to keep in history (default: 10).
 * @param {number} hoverThreshold - Time in milliseconds before a hover is recorded (default: 1000ms).
 *
 * @returns {Object} An object containing:
 *   - currentData: The most recent contextual data.
 *   - history: An array of past interactions.
 *   - handleHover: Function to handle hover events.
 *   - handleMouseLeave: Function to handle mouse leave events.
 *   - handleInteraction: Function to handle other types of interactions (e.g., clicks).
 *
 * Usage:
 * 1. Import the hook into your component:
 *    import { useContextualData } from './path-to-this-file';
 *
 * 2. Use the hook in your component:
 *    const { currentData, history, handleHover, handleMouseLeave, handleInteraction } = useContextualData(
 *      { type: 'initial', data: null },
 *      10,  // maxHistoryLength
 *      1000 // hoverThreshold
 *    );
 *
 * 3. Apply the event handlers to your elements:
 *    <div
 *      onMouseEnter={(e) => handleHover(e.currentTarget)}
 *      onMouseLeave={handleMouseLeave}
 *      onClick={(e) => handleInteraction(e.currentTarget, 'click')}
 *      data-name="Example"
 *      data-description="This is an example"
 *    >
 *      Content here
 *    </div>
 *
 * 4. Use currentData and history in your component as needed:
 *    <pre>{JSON.stringify(currentData, null, 2)}</pre>
 *    <ul>
 *      {history.map((item, index) => (
 *        <li key={index}>{item.interactionType}: {item.data.type} - {item.data.data.name}</li>
 *      ))}
 *    </ul>
 *
 * Note: This hook is designed to work with elements that have data attributes.
 * The contextual data is extracted from these attributes.
 */
export interface ContextualData {
  type: string;
  data: any;
}

export interface ContextualDataHistory {
  timestamp: number;
  data: ContextualData;
  interactionType: string;
}
export const useContextualData = (
  initialData?: ContextualData,
  maxHistoryLength = 10,
  hoverThreshold = 1000,
) => {
  const [currentData, setCurrentData] = useState(initialData ?? null);
  const [history, setHistory] = useState<ContextualDataHistory[]>([]);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastInteractionRef = useRef<ContextualData | null>(null);

  const updateHistory = useCallback(
    (newData: ContextualData, interactionType: string) => {
      setHistory((prev) => {
        // Check if the new entry is different from the last one
        const isDifferent =
          JSON.stringify(lastInteractionRef.current) !==
          JSON.stringify(newData);

        if (isDifferent) {
          lastInteractionRef.current = newData;
          const newEntry = {
            timestamp: Date.now(),
            data: newData,
            interactionType,
          };
          return [newEntry, ...prev].slice(0, maxHistoryLength);
        }
        return prev;
      });
    },
    [maxHistoryLength],
  );

  const onMouseEnter = useCallback(
    (event: MouseEvent) => {
      const element = event.target;
      if (!(element instanceof HTMLElement)) return;

      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }

      hoverTimerRef.current = setTimeout(() => {
        const contextData = getContextData(element);
        if (contextData) {
          const data = {
            type: element.tagName.toLowerCase(),
            interaction: "hover",
            data: contextData,
          };
          setCurrentData(data);
          updateHistory(data, "hover");
        }
      }, hoverThreshold);
    },
    [updateHistory, hoverThreshold],
  );

  const onMouseLeave = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
  }, []);

  const onInteraction = useCallback(
    (element: HTMLElement, interactionType: string) => {
      const contextData = getContextData(element);
      if (!contextData) return;
      const data = {
        type: element.tagName.toLowerCase(),
        interaction: interactionType,
        data: contextData,
      };
      setCurrentData(data);
      updateHistory(data, interactionType);
    },
    [updateHistory],
  );

  const onClick = useCallback(
    (element: MouseEvent) => {
      if (!(element instanceof HTMLElement)) return;
      onInteraction(element, "click");
    },
    [onInteraction],
  );

  return {
    currentData,
    history,
    onInteraction,
    eventHandlers: {
      onMouseEnter,
      onMouseLeave,
      onClick,
    },
  };
};

/**
 * Check if an element has a data attribute
 * @param element - The element to check
 * @param attribute - The attribute to check for
 * @returns true if the element has the attribute, false otherwise
 */
const hasDataAttribute = (element: HTMLElement, attribute: string) => {
  return element.dataset[attribute] !== undefined;
};

/**
 * Check if an element has a data attribute in any of its parents
 * @param element - The element to check
 * @param attribute - The attribute to check for
 * @returns The parent element if the attribute is found, undefined otherwise
 */
const hasDataAttributeParent = (element: HTMLElement, attribute: string) => {
  let currentElement: HTMLElement | null = element;
  while (currentElement) {
    if (hasDataAttribute(currentElement, attribute)) return currentElement;
    currentElement = currentElement.parentElement;
  }
  return undefined;
};

/**
 * Get the data attribute from an element or its closest parent
 * @param element - The element to check
 * @returns The data attribute value
 */
const getContextData = (element: HTMLElement) => {
  const parent = hasDataAttributeParent(element, "contextData");
  return parent ? parent.dataset.contextData : element.dataset.contextData;
};
