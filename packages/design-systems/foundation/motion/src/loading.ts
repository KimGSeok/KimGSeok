import { useEffect, useRef, useState } from 'react';

export interface StableLoadingOptions { delayMs?: number; minimumVisibleMs?: number; }

export function normalizeStableLoadingOptions({ delayMs = 200, minimumVisibleMs = 400 }: StableLoadingOptions = {}) {
  return {
    delayMs: Number.isFinite(delayMs) ? Math.max(0, delayMs) : 200,
    minimumVisibleMs: Number.isFinite(minimumVisibleMs) ? Math.max(0, minimumVisibleMs) : 400,
  };
}

export function useStableLoading(active: boolean, options?: StableLoadingOptions) {
  const { delayMs, minimumVisibleMs } = normalizeStableLoadingOptions(options);
  const [visible, setVisible] = useState(false);
  const shownAt = useRef<number | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (active && !visible) {
      timer = setTimeout(() => {
        shownAt.current = Date.now();
        setVisible(true);
      }, delayMs);
    } else if (!active && visible) {
      const elapsed = shownAt.current === null ? minimumVisibleMs : Date.now() - shownAt.current;
      timer = setTimeout(() => {
        shownAt.current = null;
        setVisible(false);
      }, Math.max(0, minimumVisibleMs - elapsed));
    } else if (!active) {
      shownAt.current = null;
    }
    return () => { if (timer !== undefined) clearTimeout(timer); };
  }, [active, delayMs, minimumVisibleMs, visible]);

  return visible;
}
