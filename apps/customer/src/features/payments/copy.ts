// Exact wording from design/source/Payments.dc.html.
// English first, Tamil secondary. These move into en.json / ta.json when i18next is added.

import type { UpiAppChoice } from './types';

export const paymentsCopy = {
  title: 'Payments',
  titleTamil: 'பணம் செலுத்துதல்',
  directTitle: 'You pay workers directly',
  directBody:
    "Payments go from your UPI app straight to the worker's bank. Kaithozhil never stores your bank or card details.",
  preferredApp: 'Preferred UPI app',
  preferredAppHint: "We'll open this app when you pay · நீங்கள் விரும்பும் UPI செயலி",
  recent: 'Recent payments',
  paid: 'Paid ✓',
} as const;

/** The UPI app choices, in the design's order, with the letters shown in their tiles. */
export const upiApps: readonly { id: UpiAppChoice; name: string; initials: string }[] = [
  { id: 'gpay', name: 'Google Pay', initials: 'G' },
  { id: 'phonepe', name: 'PhonePe', initials: 'P' },
  { id: 'paytm', name: 'Paytm', initials: 'Pt' },
  { id: 'bhim', name: 'BHIM', initials: 'B' },
  { id: 'ask', name: 'Ask me every time', initials: '?' },
];
