// useYDoc.ts
import { useCallback, useState } from "react";
import * as Y from "yjs";

import { YDocOptions } from "./types";

export const useYDoc = ({ documentId, initialText = "" }: YDocOptions) => {
  const [state] = useState(() => {
    const yDoc = new Y.Doc();
    const text = yDoc.getText("shared-text");
    text.insert(0, initialText);
    return { yDoc, text };
  });

  const cleanup = useCallback(() => {
    state.yDoc.destroy();
  }, [state.yDoc]);

  return { ...state, cleanup };
};
