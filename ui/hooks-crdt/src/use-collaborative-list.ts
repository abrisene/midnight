// hooks/useCollaborativeList.ts
import { useState, useCallback, useEffect } from "react";
import * as Y from "yjs";
import { useWebSocketProvider } from "./use-yjs-provider-ws";
import { useAwareness } from "./use-awareness";
import { WebSocketOptions } from "./types";

interface ListItem<T> {
  id: string;
  data: T;
  order: number;
}

export function useCollaborativeList<T>(
  options: WebSocketOptions & {
    initialItems?: ListItem<T>[];
  }
) {
  const [state] = useState(() => {
    const yDoc = new Y.Doc();
    const yMap = yDoc.getMap("shared-list");

    if (options.initialItems) {
      options.initialItems.forEach(item => {
        yMap.set(item.id, item);
      });
    }

    return { yDoc, yMap };
  });

  const { wsProvider, status, error } = useWebSocketProvider(state.yDoc, options);
  const awareness = useAwareness(wsProvider);

  const [items, setItems] = useState<ListItem<T>[]>([]);

  useEffect(() => {
    const updateItems = () => {
      const newItems = Array.from(state.yMap.values()) as ListItem<T>[];
      setItems(newItems.sort((a, b) => a.order - b.order));
    };

    state.yMap.observe(updateItems);
    updateItems();

    return () => {
      state.yMap.unobserve(updateItems);
    };
  }, [state.yMap]);

  return {
    items,
    addItem: useCallback((data: T) => {
      const id = crypto.randomUUID();
      const maxOrder = Math.max(...items.map(item => item.order), -1);
      state.yMap.set(id, { id, data, order: maxOrder + 1 });
    }, [state.yMap, items]),
    updateItem: useCallback((id: string, data: T) => {
      const existing = state.yMap.get(id) as ListItem<T>;
      if (existing) {
        state.yMap.set(id, { ...existing, data });
      }
    }, [state.yMap]),
    deleteItem: useCallback((id: string) => {
      state.yMap.delete(id);
    }, [state.yMap]),
    moveItem: useCallback((fromId: string, toId: string) => {
      const items = Array.from(state.yMap.values()) as ListItem<T>[];
      const fromItem = items.find(item => item.id === fromId);
      const toItem = items.find(item => item.id === toId);

      if (fromItem && toItem) {
        const newOrder = items
          .sort((a, b) => a.order - b.order)
          .map(item => {
            if (item.id === fromId) return { ...item, order: toItem.order };
            if (item.order > fromItem.order && item.order <= toItem.order) {
              return { ...item, order: item.order - 1 };
            }
            if (item.order < fromItem.order && item.order >= toItem.order) {
              return { ...item, order: item.order + 1 };
            }
            return item;
          });

        newOrder.forEach(item => {
          state.yMap.set(item.id, item);
        });
      }
    }, [state.yMap]),
    wsProvider,
    status,
    error,
    ...awareness,
  };
}
