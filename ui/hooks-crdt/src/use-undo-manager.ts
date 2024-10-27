// useUndoManager.ts
import { useState, useEffect } from 'react';
import * as Y from 'yjs';
import type { UseUndoManager } from './types';

const useUndoManager: UseUndoManager = (yText) => {
  const [undoManager] = useState(() => new Y.UndoManager(yText));
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    const updateState = () => {
      setCanUndo(undoManager.canUndo());
      setCanRedo(undoManager.canRedo());
    };

    undoManager.on("stack-item-added", updateState);
    undoManager.on("stack-item-popped", updateState);

    return () => {
      undoManager.off("stack-item-added", updateState);
      undoManager.off("stack-item-popped", updateState);
    };
  }, [undoManager]);

  return {
    undo: () => undoManager.undo(),
    redo: () => undoManager.redo(),
    canUndo,
    canRedo,
  };
};

export default useUndoManager;
