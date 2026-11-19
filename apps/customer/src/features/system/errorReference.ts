/**
 * The reference shown on Something went wrong, in the design's form "KT-ERR-4821".
 *
 * Until error reporting (Sentry) is added, nothing is stored under this
 * reference: it only lets support match what the customer reads out. When
 * Sentry arrives, the reference becomes the reported event's id.
 */
export function makeErrorReference(random: () => number = Math.random): string {
  const digits = Math.floor(random() * 10_000)
    .toString()
    .padStart(4, '0');
  return `KT-ERR-${digits}`;
}
