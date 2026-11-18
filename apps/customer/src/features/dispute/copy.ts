// Exact wording from design/source/{ReportProblem,WorkRecord,Settlement,DisputeStatus}.dc.html.
// English first, Tamil secondary. These move into en.json / ta.json when i18next is added.
//
// Square-bracket values are decisions still to be made (DESIGN.md "Placeholders to decide").

import type { DisputeSide, Mark, SettlementPlan } from './types';

export const jobLineCopy = {
  title: (summary: string, jobId: string) => `${summary} · ${jobId}`,
  detail: (people: string, day: string, paid: string) => `${people} · ${day} · ${paid} paid so far`,
} as const;

export type ProblemReason = { key: string; label: string };

export const reportCopy = {
  title: 'Report a problem',
  titleTamil: 'சிக்கலைத் தெரிவிக்கவும்',
  unsafeTitle: 'I feel unsafe',
  unsafeDetail: 'Leave now and call our safety line',
  reasonsHeading: 'What went wrong? ',
  reasonsHeadingTamil: '· என்ன தவறு?',
  reasonsLabel: 'What went wrong',
  reasons: {
    customer: [
      { key: 'quality', label: "Work quality isn't right" },
      { key: 'unfinished', label: "Work isn't finished" },
      { key: 'overcharging', label: 'Asking for more than agreed' },
      { key: 'damage', label: 'Damage to my home' },
      { key: 'stoppedComing', label: 'Worker stopped coming' },
      { key: 'other', label: 'Something else' },
    ],
    worker: [
      { key: 'notPaying', label: "Customer won't pay" },
      { key: 'unpaidExtra', label: 'Extra work added without paying' },
      { key: 'jobChanged', label: 'Customer changed the job' },
      { key: 'unsafe', label: 'Rude or unsafe behaviour' },
      { key: 'cancelledMidway', label: 'Customer cancelled midway' },
      { key: 'other', label: 'Something else' },
    ],
  } satisfies Record<DisputeSide, readonly ProblemReason[]>,
  detailsLabel: 'Tell us what happened',
  detailsHint: "e.g. Second coat is patchy in bedroom 2, and the kitchen isn't started",
  addPhotos: 'Add photos',
  pauseNoteBold: 'Reporting pauses the job and any payments',
  pauseNoteRest: (other: string) =>
    ` until it's sorted. ${other} is told and can give their side. Work already done is recorded, so nobody loses what's fair.`,
  send: 'Report and pause the job',
  chooseReason: 'Choose what went wrong',
  pausedTitle: 'Job paused',
  pausedTitleTamil: 'வேலை நிறுத்தி வைக்கப்பட்டது',
  pausedBody: (other: string) =>
    `We've told ${other}. Next, record what's been done so far. Most problems are sorted between you in a few minutes.`,
  recordWork: 'Record the work done',
  talkFirst: (other: string) => `Talk to ${other} first`,
} as const;

export const markWords: Record<Mark, string> = {
  notDone: 'Not done',
  partly: 'Partly',
  done: 'Done',
};

export const MARKS: readonly Mark[] = ['notDone', 'partly', 'done'];

export const workCopy = {
  title: 'Record the work done',
  titleTamil: 'செய்த வேலையைப் பதிவு செய்யவும்',
  intro: (other: string) =>
    `Mark each part of the agreed plan. ${other} does the same on his phone. Where you agree, it's settled; where you differ, photos help decide.`,
  weight: (percent: number) => `${percent}% of the job`,
  agreed: 'Agreed',
  different: 'Different',
  otherSays: (other: string, mark: string, photos: number) =>
    `${other} says: ${mark} · ${photos} photos`,
  // NOT visible in the design: spoken name of each mark button, so "Done"
  // says which milestone it marks.
  markLabel: (mark: string, milestone: string) => `${mark}, ${milestone}`,
  photosNote: 'Photos are time-stamped and saved with the job.',
  doneByYou: 'Done, by your marking · ',
  agreedOf: (agreed: number, total: number) => `${agreed} of ${total} agreed`,
  percent: (value: number) => `${value}%`,
  otherMarking: (other: string, percent: number) => `${other}'s marking: ${percent}%`,
  next: "Next: agree what's fair to pay",
} as const;

export const settleCopy = {
  title: 'Settle the payment',
  titleTamil: 'பணத் தீர்வு',
  quoteRow: 'Agreed quote',
  doneRow: 'Work done (agreed)',
  doneRowDetail: 'From your work record',
  doneValue: (percent: number) => `about ${percent}%`,
  valueRow: 'Value of work done',
  paidRow: 'Already paid',
  minus: (amount: string) => `− ${amount}`,
  dueRow: 'Fair amount still due',
  chooseHeading: 'What would you like to do?',
  optionsLabel: 'Settlement option',
  options: {
    endNow: {
      title: () => 'Pay for the work done and end the job',
      detail: (worker: string) =>
        `${worker} is paid for what's finished. You're free to hire someone else.`,
    },
    finish: {
      title: (worker: string) => `${worker} finishes the remaining work`,
      detail: () => "You pay the rest when the work is complete and you've checked it.",
    },
  } satisfies Record<
    SettlementPlan,
    { title: (worker: string) => string; detail: (worker: string) => string }
  >,
  /** The plan in one line, on the waiting, offer and agreed cards. */
  planText: {
    endNow: () => 'Pay for the work done and end the job',
    finish: (worker: string) => `${worker} finishes, then the rest is paid`,
  } satisfies Record<SettlementPlan, (worker: string) => string>,
  offerLabel: 'Your offer',
  offerDetail: 'You can change the amount',
  rupee: '₹',
  offerNoteBefore: (worker: string) => `${worker} gets `,
  offerNoteMiddle: ' more, so ',
  offerNoteAfter: " in total for this job. Kaithozhil's fee applies only to what's actually paid.",
  send: (worker: string) => `Send offer to ${worker}`,
  askReview: "Can't agree? Ask Kaithozhil to review",
  sentTitle: (worker: string) => `Offer sent to ${worker}`,
  sentBody: (plan: string, amount: string, worker: string) =>
    `${plan}, ${amount}. ${worker} can accept, or reply with his own amount.`,
  noReply: 'No reply? Ask Kaithozhil to review',
  agreedTitle: (time: string) => `Settled · both agreed at ${time}`,
  payBefore: 'Pay ',
  payAfter: ' to close the job. The job record shows the agreed work and amount.',
  pay: (amount: string) => `Pay ${amount}`,
} as const;

export const disputeCopy = {
  // The design's aria-label on the back button.
  back: 'Back',
  title: (caseId: string) => `Case ${caseId}`,
  titleTamil: 'புகார் நிலை',
  status: { review: 'Under review', decided: 'Decided' },
  // NOT visible in the design: spoken name of the header pill.
  statusLabel: (status: string) => `Status: ${status}`,
  steps: {
    reported: (name: string) => `Problem reported by ${name}`,
    recorded: 'Work recorded by both',
    reviewing: 'Kaithozhil is reviewing',
    reviewingTime: 'now',
    decision: 'Decision and payment',
    decisionTime: 'within [X] days',
  },
  lookingAt: "What we're looking at",
  milestonesAgreed: 'Milestones agreed',
  countOf: (count: number, total: number) => `${count} of ${total}`,
  photosFrom: (name: string) => `Photos from ${name}`,
  chatMessages: 'Messages in the job chat',
  holdBold: (amount: string) => `${amount} is on hold`,
  holdRest:
    ", not paid and not lost, until the decision. A reviewer may call you both. Please don't pay or ask for money outside the app.",
  messageReviewer: 'Message the reviewer',
  decisionDate: (date: string) => `Decision · ${date}`,
  decisionTitle: (worker: string, amount: string, percent: number) =>
    `${worker} is paid ${amount} for the work done (${percent}%)`,
  valueRow: 'Value of work done',
  paidRow: 'Already paid',
  minus: (amount: string) => `− ${amount}`,
  paysNow: (customer: string) => `${customer} pays now`,
  earningsRow: (worker: string) => `Counted in ${worker}'s earnings`,
  feeRow: "Kaithozhil's fee",
  feeValue: 'On paid amount only',
  pay: (amount: string) => `Pay ${amount} and close the job`,
  appeal: 'Disagree? Appeal within 7 days',
} as const;
