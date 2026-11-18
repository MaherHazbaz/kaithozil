import type { IconName } from '@kaithozhil/ui';

/** Who is looking at the shared problem screens. The worker side moves to the worker app (Sprint 2). */
export type DisputeSide = 'customer' | 'worker';

/** The grey job line at the top of the problem screens. */
export type DisputeJob = {
  /** e.g. "KT-20512". */
  jobId: string;
  /** e.g. "Interior walls · 2 BHK". */
  summary: string;
  icon: IconName;
  /** e.g. "Ravi S. and Priya R.". */
  people: string;
  /** e.g. "Day 4 of 4". */
  day: string;
  /** Paid so far, whole rupees. */
  paidRupees: number;
  customerFirstName: string;
  workerFirstName: string;
};

/** How far a milestone got, as each side marks it on Record the work done. */
export type Mark = 'notDone' | 'partly' | 'done';

/** One part of the agreed plan. */
export type Milestone = {
  id: string;
  name: string;
  /** Share of the whole job, whole percent. The plan's weights add up to 100. */
  weightPercent: number;
  /** How the other side marked it. */
  otherMark: Mark;
  photoCount: number;
};

/** Settle the payment's two choices. */
export type SettlementPlan = 'endNow' | 'finish';

export type SettlementOffer = { plan: SettlementPlan; amountRupees: number };

/** The figures at the top of Settle the payment. */
export type SettlementTerms = {
  quoteRupees: number;
  /** Work done as agreed on the work record, whole percent. */
  donePercent: number;
  paidRupees: number;
  /** e.g. "Materials, paid at the start". */
  paidNote: string;
};

/**
 * Where the settlement stands, as the customer sees it. The server decides
 * this; the screen only moves forward after a server action succeeds.
 * Settlement.dc.html's "Worker responds" view (accept or counter an offer)
 * belongs to the worker app (Sprint 2).
 */
export type SettlementState =
  | { view: 'propose' }
  | { view: 'sent'; offer: SettlementOffer }
  | { view: 'agreed'; offer: SettlementOffer; agreedAt: string };

export type DisputeDecision = {
  /** e.g. "Mon 24 Nov". */
  date: string;
  donePercent: number;
  valueRupees: number;
  paidRupees: number;
  /** The reviewer's explanation. */
  summary: string;
};

export type DisputeCase = {
  /** e.g. "D-0312". */
  caseId: string;
  /** The support ticket the reviewer answers in. */
  ticketId: string;
  job: DisputeJob;
  reportedBy: string;
  reportedAt: string;
  recordedAt: string;
  evidence: {
    milestonesAgreed: number;
    milestonesTotal: number;
    photos: readonly { from: string; count: number }[];
    chatMessages: number;
  };
  /** The amount the two sides disagree about, whole rupees. */
  amountInQuestionRupees: number;
  /** Null while Kaithozhil is reviewing. */
  decision: DisputeDecision | null;
};
