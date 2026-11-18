import type { SearchFilter, WorkerResult } from './types';

/** "Near me" radius. Not stated in the design; see the open question in the screen report. */
export const NEAR_ME_KM = 5;

/**
 * Words that mean "this trade" even when no listed work sample mentions them,
 * so "switchboard repair" finds every electrician, not only the one whose
 * photos show a switchboard. A stand-in until search runs on the server.
 */
const TRADE_TERMS: Record<string, readonly string[]> = {
  Electrician: [
    'electrician',
    'electrical',
    'electric',
    'switch',
    'switchboard',
    'socket',
    'wiring',
    'wire',
    'fan',
    'light',
    'led',
    'inverter',
    'panel',
    'mcb',
    'power',
  ],
};

/** Shorter words ("a", "to", "of") would match almost anything. */
const MIN_WORD_LENGTH = 3;

const words = (text: string) =>
  text
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((word) => word.length >= MIN_WORD_LENGTH);

const searchTerms = (worker: WorkerResult) => [
  ...words(worker.name),
  ...words(worker.trade),
  ...worker.work.flatMap((sample) => words(sample.label)),
  ...(TRADE_TERMS[worker.trade] ?? []),
];

/** Prefix match both ways: "switch" finds "switchboard", "switchboards" finds "switchboard". */
const wordMatches = (queryWord: string, term: string) =>
  term.startsWith(queryWord) || queryWord.startsWith(term);

const matchesQuery = (worker: WorkerResult, query: string) => {
  const queryWords = words(query);
  if (queryWords.length === 0) return true;
  const terms = searchTerms(worker);
  return queryWords.some((queryWord) => terms.some((term) => wordMatches(queryWord, term)));
};

const PASSES: Record<SearchFilter, (worker: WorkerResult) => boolean> = {
  nearMe: (worker) => worker.distanceKm <= NEAR_ME_KM,
  rating45: (worker) => worker.rating >= 4.5,
  level2Up: (worker) => worker.level !== null && worker.level >= 2,
  freeThisWeek: (worker) => worker.freeThisWeek,
};

/**
 * The workers that match the typed query and every chosen filter, in the
 * order given (the server's "Best match" ranking).
 */
export function matchWorkers(
  workers: readonly WorkerResult[],
  { query, filters }: { query: string; filters: readonly SearchFilter[] },
): WorkerResult[] {
  return workers.filter(
    (worker) => matchesQuery(worker, query) && filters.every((filter) => PASSES[filter](worker)),
  );
}

/**
 * The number in "12 electricians near Anna Nagar". The server reports how many
 * workers it found (`total`) but sends only the first page (`listed`). Until
 * the user narrows that page on the phone, the server's total is the truth;
 * after that, only the narrowed count is known.
 */
export function resultCount({
  total,
  listed,
  matched,
}: {
  total: number;
  listed: number;
  matched: number;
}): number {
  return matched === listed ? total : matched;
}
