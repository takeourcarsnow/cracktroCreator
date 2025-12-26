import { useState, useEffect, useCallback, RefObject } from 'react';

interface Size {
  width: number;
  height: number;
}

export function useResizeObserver(ref: RefObject<HTMLElement | null>): Size {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  const handleResize = useCallback((entries: ResizeObserverEntry[]) => {
    if (entries[0]) {
      const { width, height } = entries[0].contentRect;
      setSize({ width, height });
    }
  }, []);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver(handleResize);
    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, handleResize]);

  return size;
}
