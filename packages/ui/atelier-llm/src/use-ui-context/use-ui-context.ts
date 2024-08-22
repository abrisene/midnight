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

  const handleHover = useCallback(
    (element: HTMLElement) => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }

      hoverTimerRef.current = setTimeout(() => {
        const data = {
          type: element.tagName.toLowerCase(),
          data: { ...element.dataset },
        };
        setCurrentData(data);
        updateHistory(data, "hover");
      }, hoverThreshold);
    },
    [updateHistory, hoverThreshold],
  );

  const handleMouseLeave = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
  }, []);

  const handleInteraction = useCallback(
    (element: HTMLElement, interactionType: string) => {
      const data = {
        type: element.tagName.toLowerCase(),
        data: { ...element.dataset },
      };
      setCurrentData(data);
      updateHistory(data, interactionType);
    },
    [updateHistory],
  );

  return {
    currentData,
    history,
    handleHover,
    handleMouseLeave,
    handleInteraction,
  };
};
