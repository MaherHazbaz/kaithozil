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
