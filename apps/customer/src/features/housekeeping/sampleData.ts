// The sample data drawn in design/source/{TrialDecision,HousekeepingPlan,LeaveApprove}.dc.html.
// It stands in for the server until Supabase is wired (Sprint 2).
import type {
  AttendanceStatus,
  Housekeeper,
  LeaveRequest,
  RegularHelp,
  TrialSummary,
} from './types';

export const sampleHousekeeper: Housekeeper = {
  id: 'lakshmi-r',
  name: 'Lakshmi R.',
  firstName: 'Lakshmi',
  initials: 'LR',
};

export const sampleTrial: TrialSummary = {
  helpId: 'help-1',
  housekeeper: sampleHousekeeper,
  when: 'Trial · Wed 1 Oct · 6:02 – 8:05 AM',
  tasks: ['Sweeping and mopping', 'Dishes'],
  ifContinue: [
    { label: 'Days', value: 'Mon – Sat' },
    { label: 'Time', value: '6 – 8 AM' },
    { label: 'Starts', value: 'Thu 2 Oct' },
    { label: 'Pay', labelDetail: 'For days worked, in the app', value: '[MONTHLY RATE] a month' },
  ],
  startsAt: 'Thu 2 Oct, 6 AM',
};

export const sampleLeave: LeaveRequest = {
  id: 'leave-1',
  dates: 'Fri 21 and Sat 22 Nov',
  reason: 'family function',
  rows: [
    { label: 'Fri 21 Nov', labelDetail: '1 paid leave day left this month', value: 'Paid leave' },
    { label: 'Sat 22 Nov', labelDetail: 'Not charged to you', value: 'Unpaid' },
    { label: 'Back on', value: 'Mon 24 Nov' },
  ],
  shortDays: 'Fri and Sat',
  monthName: 'November',
};

// The design's November grid, day 1 first. It starts on a Sunday, which
// matches November 2026.
const W: AttendanceStatus = 'worked';
const O: AttendanceStatus = 'dayOff';
const U: AttendanceStatus = 'upcoming';
// prettier-ignore
const NOVEMBER: readonly AttendanceStatus[] = [
  O, W, W, W, W, W, W, //  1 –  7
  O, W, W, 'paidLeave', W, W, W, //  8 – 14
  O, W, W, W, 'absent', W, W, // 15 – 21
  O, W, U, U, U, U, U, // 22 – 28
  O, U, // 29 – 30
];

export const sampleRegularHelp: RegularHelp = {
  id: 'help-1',
  housekeeper: sampleHousekeeper,
  subtitle: 'Housekeeper · ★ 4.9 · since 2 Oct',
  schedule: [
    { label: 'Days', labelDetail: 'Sunday off', value: 'Mon – Sat' },
    { label: 'Time', labelDetail: '2 hours', value: '6 – 8 AM' },
    { label: 'Tasks', labelDetail: 'Sweeping and mopping, dishes', value: 'Mopping, dishes' },
  ],
  attendance: { year: 2026, monthIndex: 10, name: 'November', days: NOVEMBER },
  // As counted by the server; shown as drawn (see the route's note on 18).
  pay: {
    heading: 'November pay · due 1 Dec',
    daysWorked: 18,
    paidLeave: 1,
    absent: 1,
    estimate: '[AMOUNT]',
    payLabel: 'Pay for November on 1 Dec',
  },
  pendingLeave: sampleLeave,
};
