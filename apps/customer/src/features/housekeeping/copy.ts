// Exact wording from design/source/{HousekeepingBook,TrialDecision,HousekeepingPlan,LeaveApprove}.dc.html.
// English first, Tamil secondary. These move into en.json / ta.json when i18next is added.
//
// Square-bracket values are decisions still to be made (DESIGN.md "Placeholders to decide").
// They stay visible, as designed.

import type { HelpType, HomeSize, HousekeepingTask, TimeSlot, Weekday } from './types';

export const bookCopy = {
  back: 'Back',
  title: 'Housekeeping',
  titleTamil: 'வீட்டு வேலை',
  typeGroup: 'Type of help',
  types: [
    {
      key: 'regular',
      icon: 'repeat',
      title: 'Regular help',
      titleTamil: 'தினசரி / வாராந்திர உதவி',
      detail: 'Same person, on set days. Pay monthly for days worked.',
    },
    {
      key: 'oneTime',
      icon: 'sparkles',
      title: 'One-time cleaning',
      titleTamil: 'ஒரு முறை சுத்தம்',
      detail: 'Deep clean or a single visit. Pay after the work.',
    },
  ] as const satisfies readonly {
    key: HelpType;
    icon: 'repeat' | 'sparkles';
    title: string;
    titleTamil: string;
    detail: string;
  }[],
  tasksHeading: 'What needs doing? ',
  tasksHeadingTamil: '· என்ன வேலை?',
  tasksGroup: 'Tasks',
  tasks: [
    { key: 'sweeping', label: 'Sweeping and mopping' },
    { key: 'dishes', label: 'Dishes' },
    { key: 'bathroom', label: 'Bathroom cleaning' },
    { key: 'laundry', label: 'Laundry' },
    { key: 'dusting', label: 'Dusting' },
    { key: 'kitchen', label: 'Kitchen cleaning' },
  ] as const satisfies readonly { key: HousekeepingTask; label: string }[],
  sizeHeading: 'Home size ',
  sizeHeadingTamil: '· வீட்டின் அளவு',
  sizeGroup: 'Home size',
  sizes: [
    { key: 'oneBhk', label: '1 BHK' },
    { key: 'twoBhk', label: '2 BHK' },
    { key: 'threeBhk', label: '3 BHK' },
    { key: 'fourBhkPlus', label: '4 BHK+' },
  ] as const satisfies readonly { key: HomeSize; label: string }[],
  daysHeading: 'Which days? ',
  daysHeadingTamil: '· எந்த நாட்கள்?',
  daysGroup: 'Days',
  days: [
    { key: 'mon', label: 'Mon' },
    { key: 'tue', label: 'Tue' },
    { key: 'wed', label: 'Wed' },
    { key: 'thu', label: 'Thu' },
    { key: 'fri', label: 'Fri' },
    { key: 'sat', label: 'Sat' },
    { key: 'sun', label: 'Sun' },
  ] as const satisfies readonly { key: Weekday; label: string }[],
  dayCount: (count: number) => `${count}${count === 1 ? ' day a week' : ' days a week'}`,
  timeHeading: 'Time ',
  timeHeadingTamil: '· நேரம்',
  timeGroup: 'Time',
  slots: [
    { key: 'six', label: '6 – 8 AM' },
    { key: 'eight', label: '8 – 10 AM' },
    { key: 'ten', label: '10 AM – 12 PM' },
    { key: 'four', label: '4 – 6 PM' },
  ] as const satisfies readonly { key: TimeSlot; label: string }[],
  hoursTitle: 'Hours each time',
  hoursTitleTamil: 'ஒவ்வொரு முறையும் எத்தனை மணி நேரம்',
  fewerHours: 'Fewer hours',
  moreHours: 'More hours',
  womanTitle: 'Prefer a woman housekeeper',
  womanDetail: "We'll show women housekeepers first",
  trialTitle: 'Start with a trial day',
  trialDetail: 'Meet and see the work before agreeing to regular days',
  estimate: 'Estimate',
  estimateRegular: '[MONTHLY RATE] a month',
  estimateOneTime: '[VISIT RATE]',
  // Worded exactly as the design's script builds it (also for 1 day or 1 hour).
  estimateRegularSub: (days: number, hours: number) =>
    `For ${days} days a week, ${hours} h a day. You pay only for days worked.`,
  estimateOneTimeSub: (size: string, hours: number) =>
    `For a ${size}, about ${hours} hours. Pay after the cleaning.`,
  manage: 'Already have regular help? Manage it',
  ctaRegular: 'Find housekeepers',
  ctaOneTime: 'Book a cleaning',
  missing: {
    tasks: 'Choose at least one task',
    days: 'Choose at least one day',
  },
} as const;

export const trialCopy = {
  back: 'Back',
  title: 'Trial day done',
  titleTamil: 'சோதனை நாள் முடிந்தது',
  // NOT visible in the design: the spoken name of the verified badge.
  verified: 'verified',
  ratingTitle: 'How was the trial?',
  ratingGroup: 'Rate from 1 to 5 stars',
  ratingWords: ['', 'Not good', 'Okay', 'Good', 'Very good', 'Excellent'] as const,
  starLabel: (stars: number) => `${stars}${stars === 1 ? ' star' : ' stars'}`,
  ifContinue: 'If you continue',
  continueWith: (firstName: string) => `Continue with ${firstName}`,
  trySomeoneElse: 'Try someone else',
  paidEitherWay: 'The trial day ([VISIT RATE]) is paid either way.',
  confirmedTitle: 'Regular help confirmed',
  confirmedDetail: (firstName: string, startsAt: string) => `${firstName} starts ${startsAt}`,
  seeRegularHelp: 'See regular help',
  otherTitle: "We'll find someone else",
  otherBody: (firstName: string) =>
    `${firstName} is paid for the trial day. Your rating stays private.`,
  findAnother: 'Find another housekeeper',
} as const;

export const planCopy = {
  back: 'Back',
  title: 'Regular help',
  titleTamil: 'தினசரி உதவி',
  active: 'Active',
  // NOT visible in the design: spoken with the "Active" pill.
  activeLabel: 'Regular help active',
  verified: 'verified',
  message: (firstName: string) => `Message ${firstName}`,
  leaveTitle: (firstName: string) => `Leave request from ${firstName}`,
  leaveDetail: (dates: string) => `${dates} · needs your OK`,
  waitingForYou: 'Waiting for you',
  checksIn: (firstName: string) => `${firstName} checks in with a code each day`,
  weekdays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const,
  status: {
    worked: 'Worked',
    paidLeave: 'Paid leave',
    absent: 'Absent',
    dayOff: 'Day off',
    upcoming: 'Coming up',
  },
  // The small mark under the date in each calendar cell.
  mark: {
    worked: '✓',
    paidLeave: 'L',
    absent: '–',
    dayOff: '',
    upcoming: '',
  },
  dayLabel: (day: number, month: string, status: string) => `${day} ${month}: ${status}`,
  legendOrder: ['worked', 'paidLeave', 'absent', 'dayOff'] as const,
  daysWorked: 'Days worked',
  paidLeave: 'Paid leave',
  paidLeaveDetail: '[LEAVE DAYS] paid leave days a month',
  absent: 'Absent',
  absentDetail: 'Not charged',
  estimatedSoFar: 'Estimated so far',
  changeDays: 'Change days',
  pause: 'Pause',
  pausedNote: (firstName: string) =>
    `Paused from tomorrow. ${firstName} has been told and won't come until you resume. `,
  resume: 'Resume',
  reportProblem: 'Report a problem',
  endArrangement: 'End this arrangement',
} as const;

export const leaveCopy = {
  back: 'Back',
  title: 'Leave request',
  titleTamil: 'விடுப்புக் கோரிக்கை',
  askedForLeave: (firstName: string) => `${firstName} asked for leave`,
  when: (dates: string, reason: string) => `${dates} · ${reason}`,
  coverTitle: 'Find someone to cover',
  coverTitleTamil: 'மாற்று ஆள் வேண்டுமா?',
  coverOn: (days: string) =>
    `A verified housekeeper will cover ${days}. You pay them for those days only.`,
  coverOff: (days: string) => `No cover: nobody comes on ${days}.`,
  approve: 'Approve leave',
  message: (firstName: string) => `Message ${firstName}`,
  decline: 'Decline',
  approvedTitle: (firstName: string) => `Leave approved · ${firstName} has been told`,
  approvedDetail: (month: string) => `Shown as leave on your ${month} record`,
  declinedTitle: 'Leave declined',
  declinedBody: (firstName: string) =>
    `${firstName} has been told. If she can't come anyway, those days show as absent and aren't charged.`,
  backToPlan: 'Back to regular help',
} as const;
