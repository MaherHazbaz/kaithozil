// Exact wording from design/source/CancelBooking.dc.html.
// English first, Tamil secondary. These move into en.json / ta.json when i18next is added.
//
// Square-bracket values are decisions still to be made (DESIGN.md "Placeholders to decide").

export const cancelCopy = {
  title: 'Cancel booking',
  titleTamil: 'முன்பதிவை ரத்து செய்',
  jobTitle: (service: string, workerName: string) => `${service} · ${workerName}`,
  onTheWay: (firstName: string) =>
    `${firstName} is already on the way. Cancelling now may mean [CANCELLATION RULE]. Cancelling before a worker accepts is always free.`,
  reschedule: 'Change the time instead?',
  rescheduleDetail: 'Pick a new slot without cancelling',
  reasonHeading: 'Why are you cancelling? ',
  reasonHeadingTamil: '· ரத்து செய்யும் காரணம்',
  // aria-label in the design.
  reasonsLabel: 'Reason for cancelling',
  reasons: [
    { key: 'foundSomeoneElse', label: 'Found someone else' },
    { key: 'workerLate', label: 'Worker is running late' },
    { key: 'wrongTime', label: 'Booked the wrong time' },
    { key: 'problemFixed', label: 'The problem is fixed' },
    { key: 'priceTooHigh', label: 'Price estimate is too high' },
    { key: 'other', label: 'Other' },
  ],
  noteLabel: 'Tell us more',
  notePlaceholder: 'Type the reason',
  confirm: 'Cancel booking',
  chooseReason: 'Choose a reason to continue',
  tellReason: 'Tell us the reason to continue',
  keep: 'Keep my booking',
} as const;

export type CancelReason = (typeof cancelCopy.reasons)[number]['key'];
