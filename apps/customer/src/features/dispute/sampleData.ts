// The sample data drawn in design/source/{ReportProblem,WorkRecord,Settlement,DisputeStatus}.dc.html.
// It stands in for the server until Supabase is wired (Sprint 2).
import type { DisputeCase, DisputeJob, Mark, Milestone, SettlementTerms } from './types';

export const sampleDisputeJob: DisputeJob = {
  jobId: 'KT-20512',
  summary: 'Interior walls · 2 BHK',
  icon: 'paintRoller',
  people: 'Ravi S. and Priya R.',
  day: 'Day 4 of 4',
  paidRupees: 7200,
  customerFirstName: 'Priya',
  workerFirstName: 'Ravi',
};

export const sampleMilestones: readonly Milestone[] = [
  {
    id: 'prep',
    name: 'Move furniture, cover floors',
    weightPercent: 10,
    otherMark: 'done',
    photoCount: 3,
  },
  { id: 'primer', name: 'Putty and primer', weightPercent: 20, otherMark: 'done', photoCount: 3 },
  {
    id: 'coat1',
    name: 'First coat, all rooms',
    weightPercent: 30,
    otherMark: 'done',
    photoCount: 3,
  },
  {
    id: 'coat2',
    name: 'Second coat, all rooms',
    weightPercent: 30,
    otherMark: 'done',
    photoCount: 3,
  },
  {
    id: 'cleanup',
    name: 'Clean-up and touch-ups',
    weightPercent: 10,
    otherMark: 'notDone',
    photoCount: 3,
  },
];

/** The customer's marks as the design opens: 75% done, 4 of 5 agreed. */
export const sampleMarks: readonly Mark[] = ['done', 'done', 'done', 'partly', 'notDone'];

export const sampleSettlementTerms: SettlementTerms = {
  quoteRupees: 18400,
  donePercent: 75,
  paidRupees: 7200,
  paidNote: 'Materials, paid at the start',
};

export const sampleDispute: DisputeCase = {
  caseId: 'D-0312',
  ticketId: 'T-1042',
  job: sampleDisputeJob,
  reportedBy: 'Priya',
  reportedAt: 'Sat 6:10 PM',
  recordedAt: 'Sat 6:31 PM',
  evidence: {
    milestonesAgreed: 4,
    milestonesTotal: 5,
    photos: [
      { from: 'Priya', count: 6 },
      { from: 'Ravi', count: 9 },
    ],
    chatMessages: 14,
  },
  amountInQuestionRupees: 6600,
  decision: null,
};

/** DisputeStatus.dc.html's "Decision made" stage. */
export const sampleDecidedDispute: DisputeCase = {
  ...sampleDispute,
  decision: {
    date: 'Mon 24 Nov',
    donePercent: 75,
    valueRupees: 13800,
    paidRupees: 7200,
    summary:
      "Bedroom 2's second coat and the clean-up weren't finished, so they're not charged. The job is now closed.",
  },
};
