// hooks/useCollaborativePresence.ts
import { useState, useEffect } from "react";
import type { WebsocketProvider } from "y-websocket";

interface PresenceData {
  status: "active" | "idle" | "offline";
  lastActive: number;
  customData?: Record<string, unknown>;
}

export const useCollaborativePresence = (
  wsProvider: WebsocketProvider | null,
  options?: {
    idleTimeout?: number;
    customData?: Record<string, unknown>;
  }
) => {
  const [presence, setPresence] = useState<Record<string, PresenceData>>({});
  const idleTimeout = options?.idleTimeout ?? 60000; // 1 minute default

  useEffect(() => {
    if (!wsProvider) return;

    let idleTimer: NodeJS.Timeout;
    let lastActivity = Date.now();

    const updatePresence = (status: "active" | "idle") => {
      wsProvider.awareness.setLocalStateField("presence", {
        status,
        lastActive: lastActivity,
        customData: options?.customData,
      });
    };

    const handleActivity = () => {
      lastActivity = Date.now();
      clearTimeout(idleTimer);
      updatePresence("active");

      idleTimer = setTimeout(() => {
        updatePresence("idle");
      }, idleTimeout);
    };

    const handleAwarenessChange = () => {
      const states = Array.from(wsProvider.awareness.getStates().entries());
      const presenceStates = Object.fromEntries(
        states.map(([clientId, state]) => [
          clientId.toString(),
          state.presence ?? { status: "offline", lastActive: 0 },
        ])
      );
      setPresence(presenceStates);
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    wsProvider.awareness.on("change", handleAwarenessChange);
    handleActivity();

    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      wsProvider.awareness.off("change", handleAwarenessChange);
    };
  }, [wsProvider, idleTimeout, options?.customData]);

  return { presence, wsProvider };
};
