/** How the worker answered a booking request (design/source/RequestSent.dc.html). */
export const BOOKING_OUTCOMES = ['waiting', 'accepted', 'newTime', 'declined'] as const;
export type BookingOutcome = (typeof BOOKING_OUTCOMES)[number];

export const isBookingOutcome = (value: unknown): value is BookingOutcome =>
  BOOKING_OUTCOMES.some((outcome) => outcome === value);

/** A two-hour window, e.g. day "Sat 15 Nov", time "10 AM – 12 PM". */
export type BookingSlot = {
  day: string;
  time: string;
};

/** A request sent to one chosen worker. */
export type BookingRequest = {
  id: string;
  worker: { firstName: string; initials: string };
  /** e.g. "Fan not working". */
  job: string;
  /** e.g. "Electrician". */
  trade: string;
  /** Lower-case plural for "Similar electricians near you", e.g. "electricians". */
  tradePlural: string;
  slot: BookingSlot;
  /** e.g. "Home · 12, 4th Street, Anna Nagar". */
  address: string;
  /** e.g. "₹400 – 700". */
  estimate: string;
  /** When the worker must answer by, e.g. "6:30 PM today". */
  replyBy: string;
};

/** The worker's counter-offer when they can't make the asked slot. */
export type SuggestedTime = {
  slot: BookingSlot;
  /** The worker's note, e.g. "Morning is already booked…". */
  message: string;
};

/** Another worker offered when the chosen one declines. */
export type SimilarWorker = {
  id: string;
  name: string;
  initials: string;
  /** e.g. "Level 3 · 3.4 km" or "New on Kaithozhil · 1.6 km". */
  detail: string;
  /** e.g. "4.9". */
  rating: string;
};
