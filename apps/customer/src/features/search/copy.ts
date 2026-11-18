// Exact wording from design/source/Search.dc.html.
// English first, Tamil secondary. These move into en.json / ta.json when i18next is added.
// The no-results wording is the system feature's emptyStateCopy.search (EmptyState.dc.html).

import type { SearchFilter } from './types';

export const searchCopy = {
  // NOT visible in the design: screen-reader names.
  back: 'Back',
  searchLabel: 'Search',
  filtersLabel: 'Filters',

  filters: {
    nearMe: 'Near me',
    rating45: 'Rating 4.5+',
    level2Up: 'Level 2 and up',
    freeThisWeek: 'Free this week',
  } satisfies Record<SearchFilter, string>,

  // The design only draws electricians; other trades need their own approved wording.
  resultsHeading: (count: number, area: string) => `${count} electricians near ${area}`,
  sortLabel: 'Best match',

  tradeLine: (trade: string, level: number | null) =>
    level === null ? `${trade} · New on Kaithozhil` : `${trade} · Level ${level}`,
  rating: (rating: number) => `★ ${rating.toFixed(1)}`,
  // The design only shows plurals ("280 jobs", "3 jobs").
  statsAfterRating: (jobs: number, km: number) =>
    ` · ${jobs} ${jobs === 1 ? 'job' : 'jobs'} · ${km.toFixed(1)} km`,
  newBadge: 'New',
  newNote: 'New workers take smaller jobs while they build their record.',
  // NOT visible in the design: the card's screen-reader name.
  workerLabel: (name: string, line: string, rating: number, jobs: number, km: number) =>
    `${name}, ${line}, rated ${rating.toFixed(1)}, ${jobs} jobs, ${km.toFixed(1)} km away`,

  urgentBefore: 'Need someone right now? ',
  urgentLink: 'Post an urgent job',
  urgentAfter: ' and the nearest free worker is called.',
} as const;
