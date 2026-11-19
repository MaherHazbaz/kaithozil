/** What the server says about the app as a whole, checked at launch and on return to the app. */
export type AppStatus = {
  /** The lowest app version still allowed to run. Older versions see Update required. */
  minimumVersion: string;
  /** True while the platform is down for an upgrade (Under maintenance). */
  maintenance: boolean;
};

/**
 * SAMPLE DATA until Supabase exists: every version is allowed and there is no
 * maintenance. The real value comes from the server, so either can be switched
 * on without an app release.
 */
const SAMPLE_APP_STATUS: AppStatus = { minimumVersion: '0.0.0', maintenance: false };

export async function fetchAppStatus(): Promise<AppStatus> {
  return SAMPLE_APP_STATUS;
}

/**
 * Compares "major.minor.patch" versions number by number, so "0.10.0" is newer
 * than "0.9.0" (a plain string comparison gets that wrong). Missing parts count
 * as 0. Returns a negative number, 0 or a positive number, like a sort comparator.
 */
export function compareVersions(a: string, b: string): number {
  const left = a.split('.').map(Number);
  const right = b.split('.').map(Number);
  for (let i = 0; i < Math.max(left.length, right.length); i += 1) {
    const difference = (left[i] ?? 0) - (right[i] ?? 0);
    if (difference !== 0) return difference;
  }
  return 0;
}

/**
 * True when this version may no longer be used. An unknown or malformed
 * version never blocks: locking someone out by mistake is worse than letting
 * one old version run a little longer.
 */
export function isUpdateRequired(currentVersion: string | undefined, status: AppStatus): boolean {
  if (!currentVersion || !isVersion(currentVersion) || !isVersion(status.minimumVersion)) {
    return false;
  }
  return compareVersions(currentVersion, status.minimumVersion) < 0;
}

function isVersion(value: string): boolean {
  return /^\d+(\.\d+)*$/.test(value);
}
