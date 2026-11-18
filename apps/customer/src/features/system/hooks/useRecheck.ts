import { useCallback, useEffect, useRef, useState } from 'react';

/** idle: first shown. checking: a check is running. still: the last check failed. */
export type RecheckStatus = 'idle' | 'checking' | 'still';

/**
 * The "Try again" / "Check again" behaviour of No internet and Under
 * maintenance: press, show "Checking…", then either leave the screen or show
 * the "still" message.
 *
 * `check` resolves true when the problem is over (connected / back online).
 * The screen only displays the status; where the answer comes from (a network
 * check, a server flag) is up to the caller.
 */
export function useRecheck(check: () => Promise<boolean>, onRecovered: () => void) {
  const [status, setStatus] = useState<RecheckStatus>('idle');
  // A check can finish after the screen has closed; never set state then.
  const mounted = useRef(true);
  useEffect(
    () => () => {
      mounted.current = false;
    },
    [],
  );

  const recheck = useCallback(async () => {
    if (status === 'checking') return;
    setStatus('checking');
    let recovered = false;
    try {
      recovered = await check();
    } catch {
      // A failed check is the same as "still down" from the user's view.
    }
    if (!mounted.current) return;
    if (recovered) onRecovered();
    else setStatus('still');
  }, [check, onRecovered, status]);

  return { status, recheck };
}
