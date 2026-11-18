import type { IconName } from '@kaithozhil/ui';

import type { PaymentStageKey, QuoteLine } from './quoteMoney';

/** A visit or start slot, e.g. { day: 'Sat 15 Nov', time: '10 AM – 12 PM' }. */
export type Slot = { day: string; time: string };

export type Address = { label: string; line: string };

/** Who was given the site visit, returned by the server once it is booked. */
export type BookedVisit = { workerName: string; workerLevel: string };

export type QuoteWorker = {
  id: string;
  name: string;
  firstName: string;
  initials: string;
  /** "Painter · Level 2 · " (the text before the rating). */
  role: string;
  rating: string;
  /** "15 Nov" */
  visitedOn: string;
};

export type Quote = {
  id: string;
  /** "Interior walls · 2 BHK" */
  summary: string;
  /** "Valid 7 days" */
  validity: string;
  worker: QuoteWorker;
  /** "4 days" */
  duration: string;
  /** "Mon 17 Nov" */
  startsOn: string;
  lines: readonly QuoteLine[];
  /** "Materials first, rest at end" */
  planName: string;
  /** Paid when the work starts; the rest is due on completion. */
  atStartRupees: number;
  /** The worker's own note under the quote. */
  note?: string;
};

export type QuoteStatus = 'open' | 'accepted' | 'declined';

export type ProgressDay = {
  id: string;
  /** "Mon" */
  weekday: string;
  /** "17" */
  date: string;
  /** "2 painters · 8:55 AM – 5:40 PM" */
  team: string;
  note: string;
  /** How many progress photos the worker added that day. */
  photoCount: number;
};

export type ProgressPayment = {
  key: PaymentStageKey;
  amountRupees: number;
  /** "Mon 17 Nov" once both sides confirmed it; absent while unpaid. */
  paidOn?: string;
};

export type JobProgress = {
  jobId: string;
  /** "On track" */
  status: string;
  /** "Interior walls · 2 BHK · Ravi S." */
  summary: string;
  workerFirstName: string;
  /** "Thu 20 Nov" */
  endsOn: string;
  partsDone: number;
  partsTotal: number;
  days: readonly ProgressDay[];
  /** Index into `days` of today, if the job is running today. */
  todayIndex: number | null;
  payments: readonly ProgressPayment[];
};

export type ChangeJob = {
  icon: IconName;
  /** "Fan repair · KT-20481 · Priya R." */
  title: string;
  agreedRupees: number;
  customerFirstName: string;
  workerFirstName: string;
};

/** A proposal sent by the worker. */
export type ChangeProposal = {
  /** "Rewire the switchboard" */
  title: string;
  description: string;
  extraRupees: number;
  /** "+30 min" */
  extraTime: string;
  /** Whether the worker attached a photo (drawn as the design's placeholder). */
  hasPhoto: boolean;
};

/** What the worker fills in on "Found more work?". */
export type ChangeDraft = {
  description: string;
  extraRupees: number;
  timeKey: string;
};
