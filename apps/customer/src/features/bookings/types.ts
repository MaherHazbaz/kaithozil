import type { IconName } from '@kaithozhil/ui';

/** A job that has not finished yet. */
export type UpcomingBooking = {
  id: string;
  icon: IconName;
  /** e.g. "Painter · 2 bedroom walls". */
  title: string;
  /** When, and any other detail, e.g. "Sat 15 Nov, 9 AM". */
  detail: string;
  /** "purple" for settled states (Team confirmed), "mango" for waiting ones (Finding a worker). */
  status: { label: string; tone: 'purple' | 'mango' };
};

/** A finished job. */
export type PastBooking = {
  id: string;
  icon: IconName;
  /** e.g. "Fan repair · Murugan K.". */
  title: string;
  /** Date and job reference, e.g. "10 Nov · KT-20481". */
  detail: string;
  /** Final amount in whole rupees. */
  amountRupees: number;
};

export type BookingsTab = 'upcoming' | 'past';
