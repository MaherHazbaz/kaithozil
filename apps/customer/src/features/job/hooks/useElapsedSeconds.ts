import { useEffect, useState } from 'react';

/**
 * Whole seconds since the calling component mounted, stopping at `maxSeconds`.
 * Calls `onLimit` once the limit is reached.
 *
 * Mount the component that uses this only while recording: unmounting stops
 * the clock and the next mount starts again from 0.
 *
 * The count comes from the wall clock rather than from adding 1 per tick,
 * because timers in a busy JavaScript thread fire late and a counter would
 * drift behind the real recording.
 */
export function useElapsedSeconds(maxSeconds: number, onLimit?: () => void): number {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const startedAt = Date.now();
    const id = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      setSeconds(Math.min(maxSeconds, elapsed));
    }, TICK_MS);
    return () => clearInterval(id);
  }, [maxSeconds]);

  useEffect(() => {
    if (seconds >= maxSeconds) onLimit?.();
  }, [seconds, maxSeconds, onLimit]);

  return seconds;
}

// Several ticks per second so the display never skips a second.
const TICK_MS = 250;

/** "0:18", "1:00": how the design shows a clip's length. */
export function formatClipLength(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}
