// hooks/useCollaborativeCursor.ts
import { useEffect, useCallback, useState } from "react";
import type { WebsocketProvider } from "y-websocket";

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
  elementRef: React.RefObject<HTMLTextAreaElement | HTMLInputElement>
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

    elementRef.current?.addEventListener("select", handleSelectionChange);
    elementRef.current?.addEventListener("click", handleSelectionChange);
    elementRef.current?.addEventListener("keyup", handleSelectionChange);
    wsProvider.awareness.on("change", handleAwarenessChange);

    return () => {
      elementRef.current?.removeEventListener("select", handleSelectionChange);
      elementRef.current?.removeEventListener("click", handleSelectionChange);
      elementRef.current?.removeEventListener("keyup", handleSelectionChange);
      wsProvider.awareness.off("change", handleAwarenessChange);
    };
  }, [wsProvider, elementRef]);

  return { cursors, wsProvider };
};
