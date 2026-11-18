import type { IconName } from '@kaithozhil/ui';

/** The three construction roles a crew is made of (Crew.dc.html). */
export type CrewRole = 'mason' | 'heavyHelper' | 'siteHelper';

/** How many workers of each role. */
export type RoleCounts = Readonly<Record<CrewRole, number>>;

export type WorkType = 'house' | 'wall' | 'plaster' | 'repair';

/** What the customer chose on Book construction crew. */
export type CrewRequest = {
  work: WorkType;
  counts: RoleCounts;
  days: number;
  /** "Send as one team with a mestri". */
  withMestri: boolean;
  /** "Not sure how many workers or days?": the mestri proposes a job plan instead. */
  unsure: boolean;
};

/** One member of a crew on its public profile. */
export type CrewMember = {
  id: string;
  name: string;
  initials: string;
  /** e.g. "Mestri and mason · கொத்தனார்". */
  role: string;
  /** e.g. "Level 3", or "New" for a member without a level yet. */
  level: string;
  isNew: boolean;
};

/** A site photo from a job done through Kaithozhil. */
export type CrewSite = {
  id: string;
  caption: string;
  /** How long the job took, e.g. "2 weeks". Read by screen readers only. */
  duration: string;
  /** Stand-in drawing until mestris can upload photos. */
  icon: IconName;
};

export type CrewReview = {
  id: string;
  name: string;
  initials: string;
  job: string;
  /** e.g. "Oct". */
  date: string;
  stars: number;
  text: string;
};

/**
 * A crew's public profile (CrewProfile.dc.html). It never carries a phone
 * number or any other contact detail: booking and payment only happen
 * through the app, and chat opens once the crew is booked.
 */
export type CrewProfile = {
  id: string;
  /** e.g. "Selvam's crew". */
  name: string;
  initials: string;
  /** e.g. "Verified team · mestri Selvam R.". */
  badge: string;
  /** e.g. "New houses · walls · plastering · tiling". */
  specialities: string;
  /** e.g. "4.7". */
  rating: string;
  siteCount: number;
  experienceYears: number;
  members: readonly CrewMember[];
  /** "Selvam is responsible for the team on site." */
  mestriFirstName: string;
  sites: readonly CrewSite[];
  reviews: readonly CrewReview[];
  /** "Works in", e.g. "Anna Nagar, Ambattur, Avadi, Villivakkam". */
  areas: string;
};

/**
 * Where a job plan stands, as reported by the server.
 * "review": the mestri proposed it and it needs the customer's OK.
 * "waiting": the customer sent changes; the mestri has not answered yet.
 * "confirmed": both confirmed it.
 */
export type JobPlanStatus = 'review' | 'waiting' | 'confirmed';

/** A job plan proposed by the mestri (JobPlan.dc.html). */
export type JobPlan = {
  id: string;
  status: JobPlanStatus;
  /** When the customer confirmed, e.g. "4:10 PM". Set by the server once confirmed. */
  customerConfirmedAt?: string;
  /** The crew booking this plan belongs to ("See your crew"). */
  crewId: string;
  mestriFirstName: string;
  mestriInitials: string;
  /** e.g. "After visiting your site · New house, Anna Nagar". */
  context: string;
  counts: RoleCounts;
  days: number;
  /** e.g. "Mon 17 Nov – Sat 22 Nov". */
  dateRange: string;
  /** The mestri's note under the plan. */
  message: string;
  /** When the mestri confirmed the plan, e.g. "3:52 PM". */
  mestriConfirmedAt: string;
  /** e.g. "Mon 17 Nov, 8 AM". */
  startsAt: string;
};

/** The customer's counter-proposal. It changes nothing until the mestri accepts it. */
export type PlanChanges = {
  counts: RoleCounts;
  days: number;
  message: string;
};

/** A role line on Crew confirmed: "Mason × 2" with the members' names. */
export type TeamRole = {
  role: CrewRole;
  members: readonly { id: string; name: string; initials: string }[];
};

/** A booked crew (CrewTeam.dc.html). */
export type ConfirmedCrew = {
  id: string;
  /** e.g. "Starts tomorrow, 8 AM · 12, 4th Street, Anna Nagar". */
  startLine: string;
  mestriName: string;
  mestriFirstName: string;
  mestriInitials: string;
  /** e.g. "Mestri · team leader · Verified · ★ 4.7 · 14 yrs". */
  mestriMeta: string;
  roles: readonly TeamRole[];
  days: number;
  /** e.g. "New house". */
  workLabel: string;
};

/**
 * A day's attendance for one role, in half-day units, so "1.5 site helpers"
 * (one full day and one half day) is the whole number 3.
 */
export type AttendanceLine = { role: CrewRole; halfDays: number };

/**
 * Where a day's payment stands, as reported by the server. The phone never
 * sets this: a day is paid only once the server has recorded it.
 */
export type CrewDayStatus = 'paid' | 'due' | 'upcoming';

export type CrewDay = {
  id: string;
  /** e.g. "Wed 19 Nov". */
  date: string;
  /** e.g. "5 present · 1 half day · 1 absent". */
  summary: string;
  status: CrewDayStatus;
  attendance: readonly AttendanceLine[];
  /** When the mestri marked attendance, e.g. "8:58 AM". */
  markedAt: string;
};

/** Daily crew payments (CrewPayments.dc.html). */
export type CrewPayments = {
  crewId: string;
  /** e.g. "New house · Selvam's crew · Day 3 of 6". */
  context: string;
  mestriFirstName: string;
  totalDays: number;
  /** Days the server has recorded as paid. */
  paidDays: number;
  days: readonly CrewDay[];
};
