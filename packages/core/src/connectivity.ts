/**
 * The address used to test the connection. It answers every request with an
 * empty "204 No Content" and is the same check Android itself uses, so it is
 * tiny and always up. When Supabase exists, this moves to our own server.
 * Nothing about the customer is sent, only an empty request.
 */
export const CONNECTIVITY_CHECK_URL = 'https://clients3.google.com/generate_204';

export type IsOnlineOptions = {
  fetchImpl?: typeof fetch;
  url?: string;
  /** Give up and report offline after this long. */
  timeoutMs?: number;
};

/**
 * True when the internet can be reached. Uses the built-in `fetch` instead of
 * a native network-state package, so it adds nothing to the app's size.
 *
 * Only a 204 counts: a Wi-Fi login page (hotel, station) answers with its own
 * page instead, and that is not a working connection.
 */
export async function isOnline({
  fetchImpl = fetch,
  url = CONNECTIVITY_CHECK_URL,
  timeoutMs = 5_000,
}: IsOnlineOptions = {}): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(url, {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal,
    });
    return response.status === 204;
  } catch {
    // No network, DNS failure or timeout: all mean "offline" to the customer.
    return false;
  } finally {
    clearTimeout(timer);
  }
}
