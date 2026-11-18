// Exact wording from design/source/Post.dc.html. English first, Tamil secondary.
// These move into en.json / ta.json when i18next is added.
import type { JobProblem } from './jobDraft';

export const describeJobCopy = {
  back: 'Back',
  problemHeading: "What's the problem?",
  problemHeadingTamil: ' · என்ன பிரச்சனை?',
  problemGroupLabel: 'Problem type',
  descriptionLabel: 'Describe it (optional)',
  // NOT in the design (docs/decisions/0005-clear-job-descriptions.md): shown
  // instead of the label above when the chosen problem needs a description.
  descriptionLabelRequired: 'Describe it',
  // NOT in the design: why the main button is disabled.
  missing: {
    problem: 'Choose a problem to continue',
    description: 'Describe the problem to continue',
  },
  addPhoto: 'Add photo',
  voiceNote: 'Voice note',
  whenHeading: 'When do you need it?',
  now: { title: 'Now', subtitle: 'Nearby workers get a call right away' },
  schedule: { title: 'Schedule', subtitle: 'Pick a date and time' },
  chooseTime: 'Choose a date and time',
  durationHeading: 'How long might it take? ',
  durationHeadingTamil: '· எவ்வளவு நேரம்?',
  durationGroupLabel: 'How long it might take',
  durations: [
    { key: 'quick', label: 'Quick fix (under 1 hour)' },
    { key: 'halfDay', label: 'Half a day' },
    { key: 'fullDay', label: 'A full day or more' },
    { key: 'unsure', label: "Not sure, let's decide together" },
  ],
  durationUnsureNote:
    "That's fine. The worker checks the job, then you both agree the time and price in the app before work starts.",
  changeAddress: 'Change',
  estimateLabel: 'Estimated cost',
  estimate: (range: string) => `${range} · agreed on site`,
} as const;

// Exact wording from design/source/Searching.dc.html.
export const searchingCopy = {
  titleTamil: 'அருகில் உள்ள பணியாளரைத் தேடுகிறோம்',
  explainer: (area: string) => `We're calling verified workers near ${area}, one at a time.`,
  posted: 'Job posted',
  calling: (name: string) => `Calling ${name}`,
  next: 'Next nearest worker',
  nextDetail: (firstName: string) => `Only if ${firstName} can't take it`,
  cancel: 'Cancel request',
} as const;

// Exact wording from design/source/Tracking.dc.html.
export const trackingCopy = {
  back: 'Back',
  arrivesIn: (minutes: number) => `Arrives in ${minutes} min`,
  onTheWay: (firstName: string) => `${firstName} is on the way`,
  call: (firstName: string) => `Call ${firstName}`,
  message: (firstName: string) => `Message ${firstName}`,
  arrivalTitle: 'Step 1 · Arrival code',
  arrivalTitleTamil: 'வருகைக் குறியீடு',
  arrivalNote: (firstName: string) =>
    `Give this only when ${firstName} is at your door. It confirms he has really arrived.`,
  workStartTitle: 'Step 2 · Work-start code',
  workStartTitleTamil: 'வேலை தொடக்கக் குறியீடு',
  workStartNote: "Give this when you're ready for the work to begin.",
  // NOT visible in the design: read by screen readers in place of four separate digits.
  arrivalSpoken: (code: string) => `Arrival code ${code.split('').join(' ')}`,
  workStartSpoken: (code: string) => `Work-start code ${code.split('').join(' ')}`,
  arrived: (firstName: string, time: string) => `${firstName} arrived · ${time}`,
  arrivedDetail: 'Arrival code and location matched',
  started: (time: string) => `Work started · ${time}`,
  startedDetail: 'Work-start code matched',
  estimate: (range: string) => `Estimate ${range}`,
  payNow: 'Job finished? Pay now',
  cancel: 'Cancel booking',
  reportProblem: 'Report a problem',
} as const;

// Exact wording from design/source/Pay.dc.html.
export const payCopy = {
  title: 'Job completed',
  subtitle: (firstName: string) =>
    `${firstName} marked your job as done. Check the work, then pay.`,
  workDone: 'Work done',
  worker: 'Worker',
  jobId: 'Job ID',
  total: 'Total',
  payCta: (amount: string) => `Pay ${amount} with UPI`,
  payNote: (firstName: string) =>
    `Opens your UPI app. Money goes straight to ${firstName}'s bank account.`,
  ratingHeading: 'How was the work?',
  ratingGroupLabel: 'Rate from 1 to 5 stars',
  starLabel: (stars: number) => `${stars} ${stars === 1 ? 'star' : 'stars'}`,
  /** Shown beside the heading; index = number of stars, 0 = not rated yet. */
  ratingWords: ['', 'Poor', 'Okay', 'Good', 'Very good', 'Excellent'],
  feedbackTags: [
    { key: 'onTime', label: 'On time' },
    { key: 'neatWork', label: 'Neat work' },
    { key: 'fairPrice', label: 'Fair price' },
  ],
} as const;

export type JobService = {
  title: string;
  titleTamil: string;
  problems: readonly JobProblem[];
  /** Example shown in the empty description box. NOT in the design (decision 0005). */
  descriptionHint: string;
  /** Main button text when "Now" is chosen. */
  findCta: string;
  /** Main button text when "Schedule" is chosen. */
  scheduleCta: string;
  /** Heading on Finding a worker. */
  searchingTitle: string;
};

// The design shows this screen for Electrician only. A service is added here
// once the owner has approved its problem chips and wording; until then its
// Home tile does not open this screen.
export const jobServices = {
  electrician: {
    title: 'Electrician',
    titleTamil: 'மின் பணியாளர்',
    problems: [
      { key: 'fan', label: 'Fan' },
      { key: 'lights', label: 'Lights' },
      { key: 'switchboard', label: 'Switchboard' },
      { key: 'wiring', label: 'Wiring' },
      { key: 'fuse', label: 'Fuse / MCB' },
      { key: 'other', label: 'Other', needsDescription: true },
    ],
    // The design's own sample description, offered as an example.
    descriptionHint: 'e.g. Bedroom ceiling fan not spinning, makes a humming sound.',
    findCta: 'Find an electrician',
    scheduleCta: 'Schedule an electrician',
    searchingTitle: 'Finding an electrician',
  },
} as const satisfies Record<string, JobService>;

export type JobServiceKey = keyof typeof jobServices;

/**
 * True when `value` names a service this screen is ready for.
 *
 * Route parameters arrive as untrusted text (a deep link can carry anything),
 * so the route checks them with this before using them.
 */
export function isJobServiceKey(value: unknown): value is JobServiceKey {
  return typeof value === 'string' && Object.hasOwn(jobServices, value);
}
