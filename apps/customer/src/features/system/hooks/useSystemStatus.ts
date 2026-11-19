import { fetchAppStatus, isOnline, isUpdateRequired, type AppStatus } from '@kaithozhil/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

/** What, if anything, has to cover the app. Listed in priority order. */
export type SystemBlock = 'offline' | 'maintenance' | 'updateRequired' | null;

export type SystemStatusSources = {
  /** This app's version, e.g. "0.1.0". */
  currentVersion: string | undefined;
  checkOnline?: () => Promise<boolean>;
  loadStatus?: () => Promise<AppStatus>;
};

/**
 * Works out whether the app can be used: online, not under maintenance and
 * not too old. Checks at launch and whenever the customer comes back to the
 * app (AppState "active" = the app is in the foreground again).
 *
 * `recheckFor(block)` builds the check for a state's "Try again" button: it
 * looks again and resolves true once that particular problem is over.
 */
export function useSystemStatus({
  currentVersion,
  checkOnline = isOnline,
  loadStatus = fetchAppStatus,
}: SystemStatusSources) {
  const [block, setBlock] = useState<SystemBlock>(null);
  // Checks can overlap (launch + foreground). Only the newest one may decide.
  const latestCheck = useRef(0);

  const evaluate = useCallback(async (): Promise<SystemBlock> => {
    if (!(await checkOnline())) return 'offline';
    try {
      const status = await loadStatus();
      if (status.maintenance) return 'maintenance';
      if (isUpdateRequired(currentVersion, status)) return 'updateRequired';
    } catch {
      // Online but the status could not be read: let the app run rather
      // than block it on a check that failed.
    }
    return null;
  }, [checkOnline, loadStatus, currentVersion]);

  const refresh = useCallback(async () => {
    latestCheck.current += 1;
    const thisCheck = latestCheck.current;
    const next = await evaluate();
    if (thisCheck === latestCheck.current) setBlock(next);
    return next;
  }, [evaluate]);

  useEffect(() => {
    void refresh();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') void refresh();
    });
    return () => {
      subscription.remove();
      // Ignore any check still running after unmount.
      latestCheck.current += 1;
    };
  }, [refresh]);

  const recheckFor = useCallback(
    (current: Exclude<SystemBlock, null>) => async () => (await refresh()) !== current,
    [refresh],
  );

  return { block, recheckFor };
}
