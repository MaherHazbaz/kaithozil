import { formatRupees } from '@kaithozhil/core';

import type { BillLine, Estimate } from './types';

// Money on the bill. Whole rupees as integers, so sums cannot drift the way
// 0.1 + 0.2 does in floating point. The server recalculates all of this.

function assertWholeRupees(amount: number, what: string): void {
  if (!Number.isSafeInteger(amount) || amount < 0) {
    throw new RangeError(`${what} must be a whole, non-negative number of rupees`);
  }
}

/** The bill's total: the sum of its lines. */
export function billTotal(lines: readonly Pick<BillLine, 'amountRupees'>[]): number {
  return lines.reduce((sum, line) => {
    assertWholeRupees(line.amountRupees, 'A bill line');
    return sum + line.amountRupees;
  }, 0);
}

/** True when the total is inside the estimate, both ends included. */
export function isWithinEstimate(totalRupees: number, estimate: Estimate): boolean {
  assertWholeRupees(totalRupees, 'The total');
  return totalRupees >= estimate.minRupees && totalRupees <= estimate.maxRupees;
}

/**
 * "₹400 – 700": the rupee sign only once, as the design writes ranges. The
 * upper end goes through formatRupees too, so it gets the same digit grouping.
 */
export function formatRupeeRange({ minRupees, maxRupees }: Estimate): string {
  return `${formatRupees(minRupees)} – ${formatRupees(maxRupees).replace(/^₹/, '')}`;
}
