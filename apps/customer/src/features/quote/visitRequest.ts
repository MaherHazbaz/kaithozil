/** Answers on Request a site visit (QuoteRequest.dc.html), before they are sent. */
export type VisitDraft = {
  /** "What work is needed?": several can be chosen. */
  work: readonly string[];
  /** "How big is the job?": one. */
  size: string | null;
  /** "How many days and painters?": one, "Not sure" by default. */
  duration: string;
};

/** A draft that is ready to send. */
export type VisitRequest = Omit<VisitDraft, 'size'> & { size: string };

export type MissingVisitDetail = 'work' | 'size' | null;

/**
 * What still has to be chosen before the visit can be requested, or null.
 * In the design's order: the painter needs to know what to do, then how much.
 * The number of days can stay "Not sure": the painter suggests it in the quote.
 */
export function missingVisitDetail(draft: Pick<VisitDraft, 'work' | 'size'>): MissingVisitDetail {
  if (draft.work.length === 0) return 'work';
  if (draft.size === null) return 'size';
  return null;
}

/** Adds a work type, or removes it if it was already chosen. Keeps the order they were picked in. */
export function toggleWork(work: readonly string[], key: string): string[] {
  return work.includes(key) ? work.filter((item) => item !== key) : [...work, key];
}
