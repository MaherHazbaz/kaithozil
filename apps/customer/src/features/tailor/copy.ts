// Exact wording from design/source/{TailorBook,OrderStatus}.dc.html.
// English first, Tamil secondary. These move into en.json / ta.json when i18next is added.
//
// Square-bracket values are decisions still to be made (DESIGN.md "Placeholders to decide").

import type { NeedBy, StitchingType, TailorMethod } from './tailorDraft';
import type { OrderStage } from './types';

/** "What do you need?" chips, in the design's order. More than one can be chosen. */
export const stitchingTypes: readonly { key: StitchingType; label: string }[] = [
  { key: 'blouse', label: 'Blouse stitching' },
  { key: 'salwar', label: 'Salwar / churidar' },
  { key: 'alterations', label: 'Alterations' },
  { key: 'uniform', label: 'School uniform' },
  { key: 'bridal', label: 'Bridal wear' },
  { key: 'mens', label: "Men's shirt / pant" },
];

/** "Need it by" chips, in the design's order. */
export const needByOptions: readonly { key: NeedBy; label: string }[] = [
  { key: 'threeDays', label: 'In 3 days' },
  { key: 'week', label: 'In a week' },
  { key: 'twoWeeks', label: 'In 2 weeks' },
];

/** "How would you like it?" cards, in the design's order. */
export const tailorMethods: readonly {
  key: TailorMethod;
  icon: 'store' | 'ruler' | 'truck';
  title: string;
  titleTamil: string;
  detail: string;
  cta: string;
}[] = [
  {
    key: 'shopVisit',
    icon: 'store',
    title: "Visit the tailor's shop",
    titleTamil: 'கடைக்குச் செல்லுங்கள்',
    detail: 'Book a time to give fabric and measurements',
    cta: 'Book a shop visit',
  },
  {
    key: 'homeMeasurement',
    icon: 'ruler',
    title: 'Home measurement',
    titleTamil: 'வீட்டில் அளவெடுத்தல்',
    detail: 'The tailor comes to measure and collect fabric',
    cta: 'Book home measurement',
  },
  {
    key: 'pickup',
    icon: 'truck',
    title: 'Pickup and drop',
    titleTamil: 'எடுத்துச் சென்று திருப்பித் தருதல்',
    detail: 'Fabric collected, finished clothes delivered · [PICKUP FEE]',
    cta: 'Book pickup',
  },
];

export const tailorBookCopy = {
  back: 'Back',
  title: 'Tailor',
  titleTamil: 'தையல்காரர்',
  stitchingHeading: 'What do you need?',
  stitchingHeadingTamil: ' · என்ன தைக்க வேண்டும்?',
  // NOT visible in the design: the chip groups' screen-reader names (aria-label).
  stitchingGroup: 'Stitching type',
  methodHeading: 'How would you like it?',
  methodHeadingTamil: ' · எப்படி?',
  methodGroup: 'How',
  piecesTitle: 'How many pieces?',
  piecesTitleTamil: 'எத்தனை?',
  fewerPieces: 'Fewer pieces',
  morePieces: 'More pieces',
  needByHeading: 'Need it by',
  needByHeadingTamil: ' · எப்போது தேவை?',
  needByGroup: 'Need it by',
  useSaved: 'Use my saved measurements',
  addDesign: 'Add a design you like',
  photoNote:
    'Tailors share photos of finished clothes on their profile only with your permission, and never show faces.',
  findCta: 'Find a tailor',
  missing: {
    stitching: 'Choose what you need stitched',
    method: 'Choose shop visit, home measurement or pickup',
  },
} as const;

/** The pill in the header for each stage. */
export const orderStages: Record<OrderStage, string> = {
  stitching: 'Stitching',
  ready: 'Ready',
  delivered: 'Delivered',
};

export const orderCopy = {
  back: 'Back',
  title: 'Your order',
  titleTamil: 'உங்கள் ஆர்டர்',
  // NOT visible in the design: read before the pill so it makes sense on its own.
  statusLabel: (status: string) => `Status: ${status}`,
  tailorLine: (name: string, level: number, rating: string) =>
    `${name} · Tailor · Level ${level} · ★ ${rating}`,
  steps: {
    booked: 'Booked',
    measured: 'Measured at home',
    stitching: 'Stitching',
    stitched: 'Stitched',
    ready: 'Ready',
    readyOut: 'Ready · out for delivery',
    delivered: 'Delivered',
  },
  now: 'now',
  today: 'today',
  readyBy: (date: string) => `by ${date}`,
  how: 'How',
  due: 'Due',
  price: 'Price',
  priceDetail: (each: string, pieces: number) => `${each} × ${pieces} · pay after delivery`,
  measurements: 'Measurements',
  yourMeasurements: 'Your measurements',
  measurementsDetail: (tailorFirstName: string) =>
    `Saved by ${tailorFirstName} · used for this order`,
  handover: 'Pickup and delivery',
  handoverDetail: 'Codes and checklists for handing over',
  message: (tailorFirstName: string) => `Message ${tailorFirstName}`,
  reportProblem: 'Report a problem',
  tryOnNote: 'Try them on first. If something needs fixing, ask for an alteration before paying.',
  pay: (total: string) => `Fits well, pay ${total}`,
  alteration: 'Needs an alteration',
} as const;

// design/source/Handover.dc.html
export const handoverCopy = {
  back: 'Back',
  title: 'Pickup and delivery',
  titleTamil: 'எடுத்தல் · ஒப்படைத்தல்',
  coming: (runnerName: string) => `${runnerName} is coming for pickup`,
  comingDetail: (tailorName: string, eta: string) =>
    `For ${tailorName} (tailor) · verified · ${eta}`,
  message: (runnerFirstName: string) => `Message ${runnerFirstName}`,
  pickupCode: 'Pickup code',
  pickupCodeTamil: 'எடுப்புக் குறியீடு',
  // NOT visible in the design: read by screen readers in place of four separate digits.
  pickupSpoken: (code: string) => `Pickup code ${code.split('').join(' ')}`,
  pickupNote: (runnerFirstName: string) =>
    `Give this only when you hand over your fabric to ${runnerFirstName}.`,
  handingOver: "What you're handing over",
  pickupPhotos: (runnerFirstName: string) =>
    `${runnerFirstName} photographs the items at pickup, so there's a record.`,
  arrived: 'Your clothes are here',
  arrivedDetail: (runnerName: string, tailorName: string) =>
    `${runnerName} · delivering for ${tailorName}`,
  checkFirst: 'Check before you confirm',
  packedPhotos: (tailorFirstName: string) =>
    `Photos taken by ${tailorFirstName} when the order was packed:`,
  packedPhotoLabel: (n: number) => `Packed order photo ${n}`,
  received: "I've received everything",
  missing: "Something's missing or damaged",
  receivedTitle: (at: string) => `Received · ${at}`,
  receivedDetail: 'Try them on, then pay',
  backToOrder: 'Back to your order',
} as const;
