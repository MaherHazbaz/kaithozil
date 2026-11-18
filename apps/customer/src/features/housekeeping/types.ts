/** "Regular help" (same person on set days, paid monthly) or a one-time cleaning. */
export type HelpType = 'regular' | 'oneTime';

export type HousekeepingTask =
  'sweeping' | 'dishes' | 'bathroom' | 'laundry' | 'dusting' | 'kitchen';

export type HomeSize = 'oneBhk' | 'twoBhk' | 'threeBhk' | 'fourBhkPlus';

/** Monday first, as the design's day picker. */
export type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export type TimeSlot = 'six' | 'eight' | 'ten' | 'four';

/** Everything the Housekeeping form collects. */
export type HousekeepingDraft = {
  type: HelpType;
  tasks: readonly HousekeepingTask[];
  size: HomeSize;
  /** Only used for regular help. */
  days: readonly Weekday[];
  slot: TimeSlot;
  hours: number;
  preferWoman: boolean;
  /** Only used for regular help. */
  trialDay: boolean;
};

/** What the form still needs before it can be sent; null when ready. */
export type MissingHousekeepingDetail = 'tasks' | 'days' | null;

/** The housekeeper on an arrangement, as the cards show them. */
export type Housekeeper = {
  id: string;
  /** "Lakshmi R." */
  name: string;
  firstName: string;
  initials: string;
};

/** One label and value line (DetailRow), with optional small detail under the label. */
export type HelpRow = { label: string; labelDetail?: string; value: string };

/** "After the trial day": the finished trial and what continuing would mean. */
export type TrialSummary = {
  helpId: string;
  housekeeper: Housekeeper;
  /** "Trial · Wed 1 Oct · 6:02 – 8:05 AM" */
  when: string;
  /** The tasks done on the trial day. */
  tasks: readonly string[];
  /** "If you continue" rows: days, time, start date, pay. */
  ifContinue: readonly HelpRow[];
  /** "Thu 2 Oct, 6 AM", shown once confirmed. */
  startsAt: string;
};

/** How a day of the month went (design's calendar grid). */
export type AttendanceStatus = 'worked' | 'paidLeave' | 'absent' | 'dayOff' | 'upcoming';

export type AttendanceMonth = {
  year: number;
  /** 0-based, like Date#getMonth. */
  monthIndex: number;
  /** "November" */
  name: string;
  /** One entry per day of the month, day 1 first. */
  days: readonly AttendanceStatus[];
};

/** A leave request waiting for the customer. */
export type LeaveRequest = {
  id: string;
  /** "Fri 21 and Sat 22 Nov" */
  dates: string;
  /** "family function" */
  reason: string;
  /** Rows: each day and whether it is paid leave, then the day she is back. */
  rows: readonly HelpRow[];
  /** "Fri and Sat", for the cover note. */
  shortDays: string;
  /** "November", the record the leave is shown on. */
  monthName: string;
};

/** The month's pay, as the server counts it. */
export type MonthPay = {
  /** "November pay · due 1 Dec" */
  heading: string;
  daysWorked: number;
  paidLeave: number;
  absent: number;
  /** "[AMOUNT]" until the rate is decided. */
  estimate: string;
  /** "Pay for November on 1 Dec" */
  payLabel: string;
};

/** An active regular help arrangement (Regular help screen). */
export type RegularHelp = {
  id: string;
  housekeeper: Housekeeper;
  /** "Housekeeper · ★ 4.9 · since 2 Oct" */
  subtitle: string;
  /** Days, time, tasks rows. */
  schedule: readonly HelpRow[];
  attendance: AttendanceMonth;
  pay: MonthPay;
  /** The leave request waiting for an answer, if any. */
  pendingLeave?: LeaveRequest;
};
