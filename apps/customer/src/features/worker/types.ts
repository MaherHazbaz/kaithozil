import type { IconName } from '@kaithozhil/ui';

/** A worker as a customer sees them before booking again. */
export type WorkerProfile = {
  id: string;
  name: string;
  firstName: string;
  initials: string;
  /** Shown as the screen title, e.g. "Electrician". */
  trade: string;
  /** e.g. "Verified · Level 2". Only verified workers can be booked. */
  badge: string;
  /** e.g. "4.8". */
  rating: string;
  jobsDone: number;
  experienceYears: number;
  /** Skills and languages, e.g. "Wiring", "Tamil, English". */
  tags: readonly string[];
};

/** A time the worker can come. */
export type TimeSlot = {
  id: string;
  /** e.g. "Today". */
  day: string;
  /** e.g. "4 – 6 PM". */
  time: string;
};

/**
 * A worker's public profile (design/source/WorkerProfile.dc.html). It never
 * carries a phone number or any other contact detail: booking and payment
 * only happen through the app (DESIGN.md).
 */
export type PublicWorkerProfile = {
  id: string;
  name: string;
  firstName: string;
  initials: string;
  /** e.g. "Verified · Level 2 Electrician". */
  badge: string;
  /** e.g. ["Anna Nagar", "Kilpauk", "Aminjikarai"]. */
  areas: readonly string[];
  /** e.g. "4.8". */
  rating: string;
  reviewCount: number;
  jobsDone: number;
  /** Share of customers who booked again, e.g. 58. */
  repeatPercent: number;
  experienceYears: number;
  work: readonly PortfolioItem[];
  reviews: readonly WorkerReview[];
  about: readonly AboutFact[];
};

/** One photo from a job done through Kaithozhil, shared with the customer's permission. */
export type PortfolioItem = {
  id: string;
  caption: string;
  /** e.g. "10 Nov". Read by screen readers only; not drawn on the tile. */
  date: string;
  /** Stand-in drawing until workers can upload photos. */
  icon: IconName;
};

export type WorkerReview = {
  id: string;
  name: string;
  initials: string;
  /** e.g. "Fan repair". */
  job: string;
  /** e.g. "10 Nov". */
  date: string;
  /** Whole stars, 1 to 5. */
  stars: number;
  text: string;
};

/** One row of the About tab, e.g. Skills, Languages. */
export type AboutFact = {
  icon: IconName;
  label: string;
  value: string;
};
