/** Indian mobile numbers have 10 digits (after the +91 country code). */
export const INDIAN_MOBILE_DIGITS = 10;

/**
 * Formats what the user has typed into the Login mobile field for display,
 * e.g. "9840012345" -> "98400 12345" (design/source/Login.dc.html).
 *
 * ───────────────────────────────────────────────────────────────────────────
 * YOUR TASK (see LEARNING.md, "Your task for this step")
 *
 * Right now this returns the input unchanged. Implement it so that it:
 *   1. keeps only the digits 0-9 (drop spaces, dashes, letters, "+", etc.),
 *   2. keeps at most the first INDIAN_MOBILE_DIGITS digits,
 *   3. puts ONE space after the 5th digit, but only once a 6th digit exists
 *      ("98400" stays "98400", "984001" becomes "98400 1").
 *
 * The expected behaviour is written out as `it.todo` cases in phone.test.ts.
 * Turn each `it.todo` into a real `it(...)` with an `expect`, then make them
 * pass. Keep it a pure function: same input, same output, no side effects.
 * ───────────────────────────────────────────────────────────────────────────
 */
export function formatIndianMobile(input: string): string {
  return input;
}
