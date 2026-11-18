// Money for quoted jobs (painters, carpenters). Every amount is whole rupees,
// an integer: the app never shows paise, and integer sums cannot drift the way
// 0.1 + 0.2 does in floating point. The server recalculates all of this; these
// functions only decide what the screen shows.

/** A line of a quote: "Labour ₹9,600 · 2 painters". */
export type QuoteLine = {
  label: string;
  amountRupees: number;
  /** Small text under the amount ("2 painters"). */
  detail?: string;
};

export type PaymentStageKey = 'start' | 'completion';

export type PaymentStage = { key: PaymentStageKey; amountRupees: number };

function assertWholeRupees(amount: number, what: string): void {
  if (!Number.isSafeInteger(amount) || amount < 0) {
    throw new RangeError(`${what} must be a whole, non-negative number of rupees`);
  }
}

/** The quote's total: the sum of its lines. */
export function quoteTotal(lines: readonly Pick<QuoteLine, 'amountRupees'>[]): number {
  return lines.reduce((sum, line) => {
    assertWholeRupees(line.amountRupees, 'A quote line');
    return sum + line.amountRupees;
  }, 0);
}

/**
 * Splits the total into the two stages of QuoteView.dc.html's payment plan
 * ("₹7,200 at start · ₹11,200 on completion"). The rest is total minus the
 * start amount, so the stages always add up to the total exactly.
 */
export function paymentStages(
  totalRupees: number,
  atStartRupees: number,
): readonly [PaymentStage, PaymentStage] {
  assertWholeRupees(totalRupees, 'The total');
  assertWholeRupees(atStartRupees, 'The start payment');
  if (atStartRupees > totalRupees) {
    throw new RangeError('The start payment cannot be more than the total');
  }
  return [
    { key: 'start', amountRupees: atStartRupees },
    { key: 'completion', amountRupees: totalRupees - atStartRupees },
  ];
}

/** Agreed price plus a proposed extra (ChangeRequest.dc.html "New total"). */
export function changedTotal(agreedRupees: number, extraRupees: number): number {
  assertWholeRupees(agreedRupees, 'The agreed price');
  assertWholeRupees(extraRupees, 'The extra amount');
  return agreedRupees + extraRupees;
}

/** Largest extra a worker can type. Five digits is far above any extra on a home job. */
export const MAX_EXTRA_RUPEES = 99_999;

/**
 * Reads the "Extra amount" field. Keeps digits only, as the design's input
 * does, so a pasted "₹1,200" becomes 1200, and an empty field is 0.
 */
export function parseRupeesInput(text: string): number {
  const digits = text.replace(/[^0-9]/g, '').slice(0, String(MAX_EXTRA_RUPEES).length);
  return digits === '' ? 0 : Number.parseInt(digits, 10);
}

/** "60% done" on JobProgress.dc.html: whole percent, rounded down so 99.6% never shows as done. */
export function progressPercent(partsDone: number, partsTotal: number): number {
  if (partsTotal <= 0) return 0;
  const clamped = Math.min(Math.max(partsDone, 0), partsTotal);
  return Math.floor((clamped * 100) / partsTotal);
}
