// Exact wording from design/source/{QuoteRequest,QuoteView,JobProgress,ChangeRequest}.dc.html.
// English first, Tamil secondary. These move into en.json / ta.json when i18next is added.
//
// Square-bracket values are decisions still to be made (DESIGN.md "Placeholders to decide").

export const visitCopy = {
  back: 'Back',
  // Only the painter's wording is designed (docs/decisions/0008-more-trades.md).
  title: 'Painter',
  titleTamil: 'பெயிண்டர்',
  steps: [
    { title: 'Request a visit', detail: 'Tell us what you need' },
    { title: 'The painter visits and measures', detail: 'At a time that suits you' },
    { title: 'You get a written quote', detail: 'Accept it, ask questions, or compare' },
  ],
  workHeading: 'What work is needed? ',
  workHeadingTamil: '· என்ன வேலை?',
  workGroupLabel: 'Type of work',
  works: [
    { key: 'interior', label: 'Interior walls' },
    { key: 'exterior', label: 'Exterior walls' },
    { key: 'texture', label: 'Texture finish' },
    { key: 'waterproofing', label: 'Waterproofing' },
    { key: 'woodPolish', label: 'Wood polish' },
    { key: 'other', label: 'Other' },
  ],
  sizeHeading: 'How big is the job? ',
  sizeHeadingTamil: '· எவ்வளவு பெரியது?',
  sizeGroupLabel: 'Size of the job',
  sizes: [
    { key: 'oneRoom', label: '1 room' },
    { key: 'oneBhk', label: '1 BHK' },
    { key: 'twoBhk', label: '2 BHK' },
    { key: 'threeBhk', label: '3 BHK' },
    { key: 'wholeHouse', label: 'Whole house' },
  ],
  durationHeading: 'How many days and painters? ',
  durationHeadingTamil: '· எத்தனை நாட்கள்?',
  durationGroupLabel: 'Days needed',
  durations: [
    { key: 'unsure', label: 'Not sure, decide after the visit' },
    { key: 'oneToTwo', label: '1–2 days' },
    { key: 'threeToFive', label: '3–5 days' },
    { key: 'weekOrMore', label: 'A week or more' },
  ],
  durationUnsureNote:
    'The painter suggests the number of workers and days in the quote. Nothing is fixed until you both confirm the job plan.',
  addPhotos: 'Add photos',
  voiceNote: 'Voice note',
  visitTime: 'Visit time',
  change: 'Change',
  // NOT visible in the design: the spoken names of the two "Change" links.
  changeVisitTimeLabel: 'Change the visit time',
  changeAddressLabel: 'Change the address',
  feeNote: 'Site visit: [VISIT FEE], adjusted in the final bill if you go ahead.',
  cta: 'Request a site visit',
  missing: {
    work: 'Choose the type of work',
    size: 'Choose the size of the job',
  },
  bookedTitle: 'Visit booked',
  bookedTitleTamil: 'பார்வை உறுதி செய்யப்பட்டது',
  visitSlot: (day: string, time: string) => `${day} · ${time}`,
  bookedBefore: (name: string, level: string) => `${name} (painter, ${level}) will visit on `,
  bookedSlot: (day: string, time: string) => `${day}, ${time}`,
  bookedAfter: " to measure. You'll get a written quote in the app after the visit.",
  seeQuote: 'See the quote (after the visit)',
  goToBookings: 'Go to my bookings',
} as const;

export const quoteCopy = {
  back: 'Back',
  title: 'Your quote',
  titleTamil: 'உங்கள் மதிப்பீடு',
  // NOT visible in the design: spoken with the "Valid 7 days" pill.
  validityLabel: (validity: string) => `Quote ${validity.toLowerCase()}`,
  // NOT visible in the design: the spoken name of the verified badge.
  verified: 'verified',
  visited: (date: string) => ` · visited ${date}`,
  durationFrom: (duration: string, date: string) => `${duration}\nfrom ${date}`,
  paymentPlan: 'Payment plan',
  stages: (atStart: string, onCompletion: string) =>
    `${atStart} at start · ${onCompletion} on completion`,
  directUpiNote: (firstName: string) =>
    `You pay ${firstName} directly by UPI at each stage, inside the app, so every payment is on record. Never pay outside Kaithozhil.`,
  accept: 'Accept quote',
  ask: (firstName: string) => `Ask ${firstName}`,
  decline: 'Decline',
  compare: 'Compare: ask 2 more painters for quotes',
  acceptedTitle: 'Quote accepted',
  acceptedStarts: (firstName: string) => `${firstName} starts `,
  acceptedRest: (atStart: string) =>
    `. Pay ${atStart} for materials when he arrives. You'll see daily progress photos in your booking.`,
  seeProgress: 'See job progress',
  declinedTitle: 'Quote declined',
  declinedBody: (firstName: string) => `${firstName} has been told. Only the visit fee applies.`,
  askOthers: 'Ask other painters',
  undo: 'Undo',
} as const;

export const progressCopy = {
  back: 'Back',
  title: 'Job progress',
  titleTamil: 'வேலை முன்னேற்றம்',
  // NOT visible in the design: spoken with the "On track" pill.
  statusLabel: (status: string) => `Status: ${status}`,
  ends: (date: string) => `Ends ${date}`,
  percentDone: (percent: number) => `${percent}% done`,
  // The design's own aria-label on the bar.
  percentLabel: (percent: number) => `${percent} percent done`,
  partsDone: (done: number, total: number, firstName: string) =>
    `${done} of ${total} parts done · from ${firstName}'s daily updates`,
  dayGroupLabel: 'Day',
  dayTitle: (day: number, total: number, today: boolean) =>
    `Day ${day} of ${total}${today ? ' · today' : ''}`,
  photoLabel: (position: number) => `Progress photo ${position}`,
  paymentsTitle: 'Payments for this job',
  stageTitles: { start: 'Materials, at the start', completion: 'Rest, on completion' },
  paidDetail: (date: string) => `Paid ${date} · verified`,
  completionDetail: 'After you check the finished work',
  paidMark: ' ✓',
  // NOT visible in the design: the tick is read out as a word.
  paidLabel: 'paid',
  message: (firstName: string) => `Message ${firstName}`,
  changes: 'Changes',
  reportProblem: 'Report a problem',
} as const;

export const changeCopy = {
  back: 'Back',
  title: 'Change request',
  titleTamil: 'மாற்றக் கோரிக்கை',
  agreedSoFar: (amount: string) => `Agreed so far: ${amount}`,
  extra: (amount: string) => `+${amount}`,
  // NOT visible in the design: spoken name of the photo placeholder in the request.
  photoLabel: 'Photo of the problem',
  // Worker proposes
  proposeHeading: (customerFirstName: string) => `Found more work? Ask ${customerFirstName} first `,
  proposeHeadingTamil: '· கூடுதல் வேலை',
  whatLabel: 'What extra work is needed?',
  whatHint: 'e.g. Switchboard wiring is loose and burnt. Needs rewiring for safety.',
  amountLabel: 'Extra amount',
  amountDetail: 'Labour and parts',
  rupee: '₹',
  timeLabel: 'Extra time',
  times: [
    { key: 'min15', label: '+15 min' },
    { key: 'min30', label: '+30 min' },
    { key: 'hour1', label: '+1 hour' },
    { key: 'anotherDay', label: 'Another day' },
  ],
  addPhoto: 'Add a photo of the problem',
  newTotalBefore: (customerFirstName: string) => `New total if ${customerFirstName} approves: `,
  newTotalAfter: ". Don't start extra work until she approves in the app.",
  send: (customerFirstName: string) => `Send to ${customerFirstName}`,
  // Waiting
  waitingTitle: (customerFirstName: string) => `Waiting for ${customerFirstName}`,
  waitingBody: (extra: string, time: string) =>
    `Asked for ${extra} and ${time}. Continue the agreed work meanwhile.`,
  backToJob: 'Back to the job',
  // Customer responds
  asks: (workerFirstName: string) => `${workerFirstName} asks for extra work`,
  quoted: (text: string) => `"${text}"`,
  agreedRow: 'Agreed so far',
  extraRow: 'Extra work',
  timeRow: 'Extra time',
  newTotal: 'New total',
  approve: 'Approve extra work',
  askQuestion: 'Ask a question',
  decline: 'Decline',
  // Approved / declined
  approvedTitle: (time: string) => `Extra work approved · ${time}`,
  approvedDetail: (total: string) => `New total ${total}, recorded for both of you`,
  declinedTitle: 'Extra work declined',
  declinedBody: (agreed: string, workerFirstName: string) =>
    `The job continues as agreed, at ${agreed}. ${workerFirstName} has been told.`,
} as const;
