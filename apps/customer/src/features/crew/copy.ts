// Exact wording from design/source/{Crew,CrewProfile,JobPlan,CrewTeam,CrewPayments}.dc.html.
// English first, Tamil secondary. These move into en.json / ta.json when i18next is added.
//
// Square-bracket values are decisions still to be made (DESIGN.md "Placeholders to decide").

import type { CrewRole, WorkType } from './types';

const plural = (count: number, one: string, many: string) => (count === 1 ? one : many);

/** "7 workers × 5 days" (Crew and Job plan). */
const teamLine = (workers: number, days: number) =>
  `${workers} workers × ${days} ${plural(days, 'day', 'days')}`;
const workerDaysLine = (count: number) => `${count} worker-days`;

/** The role names, as each screen writes them. */
export const roleCopy: Record<
  CrewRole,
  {
    /** Crew.dc.html cards. */
    en: string;
    ta: string;
    desc: string;
    /** JobPlan.dc.html rows ("Masons · கொத்தனார்"). */
    plural: string;
    tamil: string;
  }
> = {
  mason: {
    en: 'Mason',
    ta: 'கொத்தனார் · Kothanaar',
    desc: 'Brickwork, plastering, tiling',
    plural: 'Masons',
    tamil: 'கொத்தனார்',
  },
  heavyHelper: {
    en: 'Heavy helper',
    ta: 'பெரியாள் · Periyaal',
    desc: 'Mixing concrete, heavy lifting',
    plural: 'Heavy helpers',
    tamil: 'பெரியாள்',
  },
  siteHelper: {
    en: 'Site helper',
    ta: 'சித்தாள் · Sithaal',
    desc: 'Carrying bricks and mortar, site cleaning',
    plural: 'Site helpers',
    tamil: 'சித்தாள்',
  },
};

export const crewBookCopy = {
  back: 'Back',
  title: 'Construction workers',
  titleTamil: 'கட்டுமான தொழிலாளர்கள்',
  // NOT visible in the design: the chip group's spoken name (its aria-label).
  workGroupLabel: 'Type of work',
  works: [
    { key: 'house', label: 'New house' },
    { key: 'wall', label: 'Compound wall' },
    { key: 'plaster', label: 'Plastering' },
    { key: 'repair', label: 'Repair work' },
  ] satisfies readonly { key: WorkType; label: string }[],
  chooseCrew: 'Prefer to choose your crew?',
  chooseCrewDetail: 'See verified mestri teams, their sites and reviews',
  unsure: 'Not sure how many workers or days?',
  unsureTamil: 'தெரியவில்லையா? மேஸ்திரி பரிந்துரைப்பார்',
  unsureNote:
    'The mestri talks to you or visits the site, then proposes a job plan: workers, days and daily rates. Work starts only after you both confirm it. The numbers below are just a starting point.',
  workersHeading: 'How many workers do you need?',
  // NOT visible in the design: the steppers' spoken names (their aria-labels).
  addOne: (role: string) => `Add one ${role}`,
  removeOne: (role: string) => `Remove one ${role}`,
  days: 'Number of days',
  daysDetail: 'எத்தனை நாட்கள் · from tomorrow, 8 AM',
  fewerDays: 'Fewer days',
  moreDays: 'More days',
  mestri: 'Send as one team with a mestri',
  mestriDetail: 'A verified team leader brings the whole crew',
  summary: teamLine,
  workerDays: workerDaysLine,
  summaryUnsure: 'Plan to be agreed',
  workerDaysUnsure: 'You confirm first',
  find: (total: number) => `Find ${total} workers`,
  // NOT visible in the design: why "Find 0 workers" does nothing.
  noWorkersHint: 'Add at least one worker',
} as const;

export const crewProfileCopy = {
  back: 'Back',
  ratingValue: (rating: string) => `★ ${rating}`,
  teamRating: 'Team rating',
  members: 'Members',
  sitesDone: 'Sites done',
  experienceValue: (years: number) => `${years} yrs`,
  experience: 'Experience',
  // NOT visible in the design: the tab group's spoken name (its aria-label).
  sections: 'Crew sections',
  teamTab: (count: number) => `Team (${count})`,
  sitesTab: (count: number) => `Sites (${count})`,
  reviewsTab: 'Reviews',
  teamNote: (mestriFirstName: string) =>
    `Every member is ID-verified. ${mestriFirstName} is responsible for the team on site.`,
  sitesNote: "Photos from sites done through Kaithozhil, shared with the owners' permission.",
  jobBadge: 'Kaithozhil job',
  // The design's aria-label on each site photo: "Compound wall, Ambattur, 2 weeks".
  siteLabel: (caption: string, duration: string) => `${caption}, ${duration}`,
  reviewMeta: (job: string, date: string) => `${job} · ${date}`,
  stars: (count: number) => '★'.repeat(count),
  // NOT visible in the design: "★★★★" read aloud is meaningless.
  starsLabel: (count: number) => `${count} ${plural(count, 'star', 'stars')}`,
  // NOT visible in the design: the member's level pill read with the row.
  memberLabel: (name: string, role: string, level: string) => `${name}, ${role}, ${level}`,
  dailyRate: 'Daily rate',
  dailyRateValue: '[DAILY RATE] per worker',
  dailyRateDetail: 'Same rate for the same task, set for this area',
  worksIn: 'Works in',
  attendance: 'Attendance',
  attendanceValue: 'Daily site photo by the mestri',
  privacyNote:
    'Book and pay only through Kaithozhil. Phone numbers stay private; you can chat with the mestri once the crew is booked.',
  book: 'Book this crew',
} as const;

export const jobPlanCopy = {
  back: 'Back',
  title: 'Job plan',
  titleTamil: 'வேலைத் திட்டம்',
  statusReview: 'Needs your OK',
  statusWaiting: (mestriFirstName: string) => `Waiting for ${mestriFirstName}`,
  statusConfirmed: 'Confirmed',
  // NOT visible in the design: the status pill's spoken form.
  statusLabel: (status: string) => `Plan status: ${status}`,
  proposed: (mestriFirstName: string) => `${mestriFirstName} proposed a plan`,
  days: 'Days',
  daysTamil: 'நாட்கள்',
  dailyRate: 'Daily rate',
  dailyRateDetail: 'Same rate for the same task in this area',
  dailyRateValue: '[DAILY RATE] per worker',
  teamLine,
  workerDays: workerDaysLine,
  payNote: 'You pay day by day for the days actually worked, from attendance.',
  messageFrom: (mestriFirstName: string) => `${mestriFirstName} · mestri`,
  lockNote:
    'Nothing starts until you confirm. Either of you can ask for changes later; both must agree.',
  confirm: 'Confirm plan',
  suggest: 'Suggest changes',
  // Suggest changes
  editHeading: 'Suggest changes ',
  editHeadingTamil: '· மாற்றம் பரிந்துரைக்கவும்',
  // NOT visible in the design: the steppers' spoken names (their aria-labels).
  less: (what: string) => `Less ${what}`,
  more: (what: string) => `More ${what}`,
  messageLabel: (mestriFirstName: string) => `Message to ${mestriFirstName} (optional)`,
  messageHint: 'e.g. Can we finish in 5 days with one more mason?',
  send: (mestriFirstName: string) => `Send changes to ${mestriFirstName}`,
  cancel: 'Cancel',
  // Changes sent
  sentTitle: (mestriFirstName: string) => `Changes sent to ${mestriFirstName}`,
  sentTitleTamil: 'மாற்றங்கள் அனுப்பப்பட்டன',
  sentBody:
    "He'll accept them or send a new plan. You'll be notified, and nothing starts until you both agree.",
  toBookings: 'Go to my bookings',
  // Confirmed
  confirmedByYou: (time: string) => `Plan confirmed by you · ${time}`,
  confirmedByMestri: (mestriFirstName: string, time: string) =>
    `${mestriFirstName} confirmed · ${time}`,
  startsBefore: 'Work starts ',
  startsAfter: '. Both of you have this plan on record.',
  seeCrew: 'See your crew',
} as const;

export const crewTeamCopy = {
  back: 'Back',
  title: 'Your crew',
  titleTamil: 'உங்கள் குழு',
  confirmed: 'Team confirmed',
  call: (mestriFirstName: string) => `Call ${mestriFirstName}`,
  roleLine: (role: string, count: number) => `${role} × ${count}`,
  roleNames: (tamil: string, names: readonly string[]) => `${tamil} · ${names.join(', ')}`,
  daysValue: (days: number) => `${days} ${plural(days, 'day', 'days')}`,
  workers: 'workers',
  workerDays: 'worker-days',
  attendanceNote: (mestriFirstName: string) =>
    `Each morning, ${mestriFirstName} marks attendance with a site photo. You'll see it here and can pay day by day.`,
  payments: 'Attendance and daily payments',
  paymentsDetail: 'See each day and pay for it',
  changeSize: 'Change team size',
} as const;

export const crewPaymentsCopy = {
  back: 'Back',
  title: 'Daily payments',
  titleTamil: 'தினசரி கட்டணம்',
  paidDays: (paid: number, total: number) => `${paid} of ${total} days paid`,
  paidSoFar: '[PAID SO FAR]',
  dayTotal: '[DAY TOTAL]',
  rateEach: '[RATE] each',
  status: { paid: 'Paid ✓', due: 'Due today', upcoming: '' },
  // NOT visible in the design: "✓" is not read out, so screen readers hear the word only.
  statusLabel: { paid: 'Paid', due: 'Due today', upcoming: '' },
  roleLine: (role: string, count: string) => `${role} × ${count}`,
  markedAt: (mestriFirstName: string, time: string) =>
    `From ${mestriFirstName}'s attendance with site photo · ${time}`,
  shareBefore: 'You pay once for the day. ',
  shareBold: 'Each worker gets their own share',
  shareAfter: ' straight to their UPI ID, so helpers are paid fairly and on time.',
  pay: (date: string) => `Pay for ${date}`,
  report: 'Attendance looks wrong? Report it',
} as const;
