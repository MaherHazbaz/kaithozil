// Money and percentages for the problem screens (Record the work done, Settle
// the payment, Dispute status). Every amount is whole rupees and every percent
// a whole number: integers add up exactly, which floating point does not. The
// server recalculates all of this; these functions only decide what is shown.

import type { Mark, Milestone, SettlementPlan, SettlementTerms } from './types';

/** A mark in halves of a milestone, so "Partly" counts as half without fractions. */
const HALVES: Record<Mark, number> = { notDone: 0, partly: 1, done: 2 };

function assertWhole(value: number, what: string): void {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new RangeError(`${what} must be a whole, non-negative number`);
  }
}

/**
 * The job's percent done by one side's marking (WorkRecord.dc.html): each
 * milestone's weight counts in full when done and half when partly done.
 * Summed in halves, then halved and rounded once, so 75% stays exactly 75.
 */
export function donePercent(
  milestones: readonly Pick<Milestone, 'weightPercent'>[],
  marks: readonly Mark[],
): number {
  const halves = milestones.reduce((sum, milestone, index) => {
    assertWhole(milestone.weightPercent, 'A milestone weight');
    return sum + milestone.weightPercent * HALVES[marks[index] ?? 'notDone'];
  }, 0);
  return Math.round(halves / 2);
}

/** How many milestones both sides marked the same ("4 of 5 agreed"). */
export function agreedCount(
  milestones: readonly Pick<Milestone, 'otherMark'>[],
  marks: readonly Mark[],
): number {
  return milestones.filter((milestone, index) => milestone.otherMark === marks[index]).length;
}

/** "Value of work done": the quote's share for the percent done, to the nearest rupee. */
export function workValueRupees(quoteRupees: number, percent: number): number {
  assertWhole(quoteRupees, 'The quote');
  assertWhole(percent, 'The percent done');
  return Math.round((quoteRupees * Math.min(percent, 100)) / 100);
}

/**
 * What is still due after what was paid. Never below zero: if more was paid
 * than the work is worth, nothing is due here (any refund is the server's call).
 */
export function amountDueRupees(valueRupees: number, paidRupees: number): number {
  assertWhole(valueRupees, 'The value');
  assertWhole(paidRupees, 'The amount paid');
  return Math.max(valueRupees - paidRupees, 0);
}

/**
 * The amount each plan starts the offer at (Settlement.dc.html): the fair
 * amount due when the job ends now, or the rest of the quote when the worker
 * finishes it.
 */
export function suggestedOfferRupees(plan: SettlementPlan, terms: SettlementTerms): number {
  if (plan === 'finish') return amountDueRupees(terms.quoteRupees, terms.paidRupees);
  return amountDueRupees(workValueRupees(terms.quoteRupees, terms.donePercent), terms.paidRupees);
}

/** "₹13,800 in total for this job": already paid plus the offer. */
export function totalForJobRupees(paidRupees: number, offerRupees: number): number {
  assertWhole(paidRupees, 'The amount paid');
  assertWhole(offerRupees, 'The offer');
  return paidRupees + offerRupees;
}

/** Longest offer that can be typed: seven digits is far above any home job. */
const MAX_OFFER_DIGITS = 7;

/**
 * Reads the "Your offer" field. Keeps digits only, as the design's input
 * does, so a pasted "₹6,600" becomes 6600, and an empty field is 0.
 */
export function parseOfferInput(text: string): number {
  const digits = text.replace(/[^0-9]/g, '').slice(0, MAX_OFFER_DIGITS);
  return digits === '' ? 0 : Number.parseInt(digits, 10);
}
