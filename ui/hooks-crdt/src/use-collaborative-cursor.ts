// hooks/useCollaborativeCursor.ts
import type { WebsocketProvider } from "y-websocket";
import { useCallback, useEffect, useState } from "react";

interface CursorPosition {
  index: number;
  length: number;
}

interface CursorAwareness {
  userId: string;
  name: string;
  color: string;
  position: CursorPosition;
}

export const useCollaborativeCursor = (
  wsProvider: WebsocketProvider | null,
  elementRef: React.RefObject<HTMLTextAreaElement | HTMLInputElement>,
) => {
  const [cursors, setCursors] = useState<CursorAwareness[]>([]);

  useEffect(() => {
    if (!wsProvider) return;

    const handleSelectionChange = () => {
      if (!elementRef.current) return;

      const { selectionStart, selectionEnd } = elementRef.current;
      wsProvider.awareness.setLocalStateField("cursor", {
        index: selectionStart ?? 0,
        length: (selectionEnd ?? 0) - (selectionStart ?? 0),
      });
    };

    const handleAwarenessChange = () => {
      const states = Array.from(wsProvider.awareness.getStates().entries());
      const cursorStates = states
        .filter(([_, state]) => state.cursor)
        .map(([clientId, state]) => ({
          userId: clientId.toString(),
          name: state.user.name,
          color: state.user.color,
          position: state.cursor,
        }));
      setCursors(cursorStates);
    };

    const current = elementRef.current;
    current?.addEventListener("select", handleSelectionChange);
    current?.addEventListener("click", handleSelectionChange);
    current?.addEventListener("keyup", handleSelectionChange);
    wsProvider.awareness.on("change", handleAwarenessChange);

    return () => {
      if (current) {
        current.removeEventListener("select", handleSelectionChange);
        current.removeEventListener("click", handleSelectionChange);
        current.removeEventListener("keyup", handleSelectionChange);
      }
      wsProvider.awareness.off("change", handleAwarenessChange);
    };
  }, [wsProvider, elementRef]);

  return { cursors, wsProvider };
};
