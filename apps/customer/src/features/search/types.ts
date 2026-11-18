import type { IconName } from '@kaithozhil/ui';

/** One tile in a worker's "recent work" strip (a photo once workers can upload them). */
export type WorkSample = {
  label: string;
  icon: IconName;
};

/** A worker as listed in search results. */
export type WorkerResult = {
  id: string;
  name: string;
  initials: string;
  /** Singular trade name, e.g. "Electrician". */
  trade: string;
  /** Skill level after the skill test. `null` while the worker is new on Kaithozhil. */
  level: number | null;
  rating: number;
  jobsDone: number;
  distanceKm: number;
  /** Has an open slot in the next seven days. Not drawn in the design; used by "Free this week". */
  freeThisWeek: boolean;
  work: readonly WorkSample[];
};

/** The four filter chips, in the design's order. */
export const SEARCH_FILTERS = ['nearMe', 'rating45', 'level2Up', 'freeThisWeek'] as const;
export type SearchFilter = (typeof SEARCH_FILTERS)[number];
