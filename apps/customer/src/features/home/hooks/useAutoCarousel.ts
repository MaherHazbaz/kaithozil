import { useCallback, useEffect, useState } from 'react';

/**
 * Index of the visible slide in an auto-advancing carousel.
 *
 * Advances every `intervalMs` and wraps around. Choosing a slide by hand
 * restarts the countdown, so the slide you picked gets its full time on screen
 * (the design clears and restarts its interval the same way).
 */
export function useAutoCarousel(count: number, intervalMs: number) {
  const [index, setIndex] = useState(0);
  // Bumping this re-runs the effect below, which restarts the interval.
  const [restarts, setRestarts] = useState(0);

  useEffect(() => {
    if (count <= 1) return;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [count, intervalMs, restarts]);

  const select = useCallback((next: number) => {
    setIndex(next);
    setRestarts((n) => n + 1);
  }, []);

  return { index, select };
}
