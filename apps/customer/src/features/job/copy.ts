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
// Home tile does not open this screen. Plumber, AC repair and Carpenter were
// approved on 2026-11-18 (docs/decisions/0008-more-trades.md): their Tamil
// titles are the design's Home tile labels, the rest is English only for now.
// Keys match the Home tiles (features/home/copy.ts), so a tile opens its entry.
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
  plumber: {
    title: 'Plumber',
    titleTamil: 'குழாய்',
    problems: [
      { key: 'tapLeak', label: 'Tap / Leak' },
      { key: 'drain', label: 'Blocked drain' },
      { key: 'toilet', label: 'Toilet / Flush' },
      { key: 'tankMotor', label: 'Water tank / Motor' },
      { key: 'pipe', label: 'Pipe fitting' },
      { key: 'other', label: 'Other', needsDescription: true },
    ],
    descriptionHint: 'e.g. Kitchen tap leaking under the sink.',
    findCta: 'Find a plumber',
    scheduleCta: 'Schedule a plumber',
    searchingTitle: 'Finding a plumber',
  },
  ac: {
    title: 'AC repair',
    titleTamil: 'ஏசி பழுது',
    problems: [
      { key: 'notCooling', label: 'Not cooling' },
      { key: 'waterLeak', label: 'Water leaking' },
      { key: 'noiseSmell', label: 'Noise / Smell' },
      { key: 'gasRefill', label: 'Gas refill' },
      { key: 'service', label: 'Service / Cleaning' },
      { key: 'install', label: 'Install / Uninstall' },
      { key: 'other', label: 'Other', needsDescription: true },
    ],
    descriptionHint: "e.g. Bedroom AC runs but doesn't cool, drips water.",
    findCta: 'Find an AC technician',
    scheduleCta: 'Schedule an AC technician',
    searchingTitle: 'Finding an AC technician',
  },
  // Small repairs only. Custom furniture fits a site visit and quote (like
  // Painter) and is added once its wording is approved.
  carpenter: {
    title: 'Carpenter',
    titleTamil: 'தச்சர்',
    problems: [
      { key: 'doorLock', label: 'Door / Lock' },
      { key: 'window', label: 'Window' },
      { key: 'furniture', label: 'Furniture repair' },
      { key: 'cupboard', label: 'Cupboard / Shelf' },
      { key: 'hinges', label: 'Hinges / Handles' },
      { key: 'other', label: 'Other', needsDescription: true },
    ],
    descriptionHint: "e.g. Bedroom door won't close, hinge is loose.",
    findCta: 'Find a carpenter',
    scheduleCta: 'Schedule a carpenter',
    searchingTitle: 'Finding a carpenter',
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

// Exact wording from design/source/Media.dc.html.
export const mediaCopy = {
  back: 'Back',
  title: 'Photos and voice note',
  titleTamil: 'படங்கள் மற்றும் குரல் குறிப்பு',
  photosHeading: 'Photos',
  photosHeadingTamil: ' · படங்கள்',
  photoCount: (count: number) => `${count} of 3 photos`,
  photoLabel: (position: number) => `Photo ${position}`,
  removePhoto: (position: number) => `Remove photo ${position}`,
  addTile: 'Add',
  takePhoto: 'Take photo',
  fromGallery: 'From gallery',
  photosHint: 'Up to 3 photos. Show the problem clearly, in good light.',
  voiceHeading: 'Voice note',
  voiceHeadingTamil: ' · குரல் குறிப்பு',
  startRecording: 'Start recording',
  tapToRecord: 'Tap to record',
  recordingLimit: 'Recording… up to 60 seconds',
  stop: 'Stop',
  play: 'Play voice note',
  recordAgain: 'Record again',
  deleteRecording: 'Delete',
  voiceHint: "Say what's wrong in Tamil or English. The worker hears it before accepting.",
  done: 'Done',
} as const;

// Exact wording from design/source/Schedule.dc.html (its script holds the day,
// month and slot names).
export const scheduleCopy = {
  back: 'Back',
  title: 'Schedule a time',
  titleTamil: 'நேரத்தைத் தேர்வு செய்யுங்கள்',
  dayHeading: 'Day',
  dayHeadingTamil: ' · நாள்',
  dayGroupLabel: 'Day',
  today: 'Today',
  tomorrowShort: 'Tmrw',
  tomorrow: 'Tomorrow',
  weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  weekdaysTamil: ['ஞாயி', 'திங்', 'செவ்', 'புத', 'வியா', 'வெள்', 'சனி'],
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  chooseDay: (longDay: string) => `Choose ${longDay}`,
  timeHeading: 'Time',
  timeHeadingTamil: ' · நேரம்',
  dayParts: {
    morning: 'Morning · காலை',
    afternoon: 'Afternoon · மதியம்',
    evening: 'Evening · மாலை',
  },
  slots: {
    8: '8 – 10 AM',
    10: '10 AM – 12 PM',
    12: '12 – 2 PM',
    14: '2 – 4 PM',
    16: '4 – 6 PM',
    18: '6 – 8 PM',
  },
  slotState: {
    available: 'Available',
    selected: 'Selected',
    full: 'Full',
    passed: 'Passed',
  },
  noticeNote: 'Book at least 2 hours ahead. The worker may arrive any time within the window.',
  yourTime: 'Your time',
  noTime: 'No time chosen yet',
  confirm: 'Confirm time',
  missing: 'Choose an available time',
} as const;

// Exact wording from design/source/MechPost.dc.html.
export const mechanicCopy = {
  back: 'Back',
  title: 'Mechanic',
  titleTamil: 'வாகன பழுது',
  vehicleHeading: 'Which vehicle?',
  vehicleHeadingTamil: ' · எந்த வாகனம்?',
  vehicleGroupLabel: 'Vehicle',
  vehicles: [
    { key: 'bike', icon: 'bike', label: 'Bike or scooter', labelTamil: 'இருசக்கர வாகனம்' },
    { key: 'car', icon: 'car', label: 'Car', labelTamil: 'கார்' },
    { key: 'autoVan', icon: 'truck', label: 'Auto or van', labelTamil: 'ஆட்டோ / வேன்' },
    { key: 'other', icon: 'wrench', label: 'Other vehicle', labelTamil: 'மற்ற வாகனம்' },
  ],
  problemHeading: "What's the problem?",
  problemHeadingTamil: ' · என்ன பிரச்சனை?',
  problemGroupLabel: 'Problem type',
  problems: [
    { key: 'wontStart', label: "Won't start" },
    { key: 'puncture', label: 'Puncture or tyre' },
    { key: 'battery', label: 'Battery' },
    { key: 'brakes', label: 'Brakes' },
    { key: 'engineNoise', label: 'Engine noise' },
    { key: 'servicing', label: 'Servicing' },
    { key: 'other', label: 'Other', needsDescription: true },
  ] satisfies readonly JobProblem[],
  descriptionLabel: 'Describe it (optional)',
  descriptionLabelRequired: 'Describe it',
  descriptionHint: "e.g. Bike won't start after rain, makes a clicking sound.",
  addPhoto: 'Add photo',
  voiceNote: 'Voice note',
  whereHeading: 'Where is the vehicle?',
  whereHeadingTamil: ' · வாகனம் எங்கே?',
  whereGroupLabel: 'Where is the vehicle',
  atHome: { title: 'At home or work', subtitle: 'Mechanic comes to you' },
  roadside: { title: 'Broken down', subtitle: 'On the road, urgent' },
  roadsideNote:
    "Stay somewhere safe, away from traffic. We'll share your live location with the mechanic.",
  whenHeading: 'When do you need it?',
  whenGroupLabel: 'When',
  now: { title: 'Now', subtitle: 'Nearby mechanics get a call' },
  schedule: { title: 'Schedule', subtitle: 'Pick a date and time' },
  chooseTime: 'Choose a date and time',
  changeAddress: 'Change',
  priceNote: 'The mechanic checks the vehicle and agrees the price with you before starting.',
  findCta: 'Find a mechanic',
  scheduleCta: 'Schedule a mechanic',
  missing: {
    vehicle: 'Choose your vehicle to continue',
    problem: 'Choose a problem to continue',
    description: 'Describe the problem to continue',
  },
} as const;
