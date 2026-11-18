import { useRef, useState } from 'react';

/**
 * Runs a server action once at a time and reports whether it is running.
 *
 * WHY the ref as well as the state: two quick taps arrive before React has
 * re-rendered with `busy = true`, so the state alone would let the second tap
 * through and accept a quote twice. The ref is updated synchronously. (The
 * server still guards against doubles with an idempotency key.)
 *
 * `run` resolves to true when the action succeeded and false when it threw,
 * so the screen moves on only after the server agreed.
 */
export function useAsyncAction() {
  const running = useRef(false);
  const [busy, setBusy] = useState(false);

  const run = async (action: () => Promise<unknown>): Promise<boolean> => {
    if (running.current) return false;
    running.current = true;
    setBusy(true);
    try {
      await action();
      return true;
    } catch {
      // The design has no error state for these actions yet (see the report):
      // staying on the same step lets the person try again.
      return false;
    } finally {
      running.current = false;
      setBusy(false);
    }
  };

  return { busy, run };
}
