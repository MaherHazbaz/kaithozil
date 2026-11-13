/**
 * Formats a whole-rupee amount for display, e.g. 650 -> "₹650"
 * (design/source/Bookings.dc.html, Pay.dc.html).
 *
 * ───────────────────────────────────────────────────────────────────────────
 * YOUR TASK (see LEARNING.md, "Your task for the Bookings step")
 *
 * Right now this only puts "₹" in front, which is correct up to ₹999. Indian
 * amounts are grouped differently from Western ones: the last three digits
 * form one group, and every group before that has TWO digits.
 *
 *   1500    -> "₹1,500"
 *   125000  -> "₹1,25,000"     (not "₹125,000")
 *   1234567 -> "₹12,34,567"
 *
 * The expected behaviour is written out as `it.todo` cases in money.test.ts.
 * Turn each into a real test, then make them pass. Keep it a pure function.
 * Amounts are whole rupees (integers); the app never shows paise.
 * ───────────────────────────────────────────────────────────────────────────
 */
export function formatRupees(amount: number): string {
  return `₹${amount}`;
}
