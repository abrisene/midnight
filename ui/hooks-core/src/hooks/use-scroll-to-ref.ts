import { useCallback, useEffect, useRef } from "react";

type ScrollToRefHook = () => (ref: React.RefObject<HTMLElement>) => void;

const useScrollToRef: ScrollToRefHook = () => {
  const scrollRef = useRef<HTMLElement | null>(null);

  const scrollToRef = useCallback((ref: React.RefObject<HTMLElement>) => {
    scrollRef.current = ref.current;
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    return () => {
      scrollRef.current = null; // Cleanup on unmount
    };
  }, []);

  return scrollToRef;
};

export default useScrollToRef;
