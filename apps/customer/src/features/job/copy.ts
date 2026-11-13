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
  changeAddress: 'Change',
  estimateLabel: 'Estimated cost',
  estimate: (range: string) => `${range} · agreed on site`,
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
