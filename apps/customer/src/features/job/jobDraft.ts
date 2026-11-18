export type JobTiming = 'now' | 'schedule';

/** The customer's guess at the job's size (design v3). "unsure" leaves it to the worker. */
export type JobDuration = 'quick' | 'halfDay' | 'fullDay' | 'unsure';

export type JobDraft = {
  /** Key of the chosen problem chip, or null while nothing is chosen. */
  problem: string | null;
  description: string;
  timing: JobTiming;
  duration: JobDuration;
};

export type JobProblem = {
  key: string;
  label: string;
  /** True for choices that say nothing by themselves ("Other"). */
  needsDescription?: boolean;
};

/** What still has to be filled in before the job can be sent, or null when it is ready. */
export type MissingJobDetail = 'problem' | 'description' | null;

/**
 * Decides whether a job says enough for a worker to act on.
 *
 * WHY: a worker who accepts a job travels to it. "Other" with no description
 * tells them nothing, so they may arrive without the right tools, or decline.
 * A named problem (Fan, Wiring...) is enough; the description then stays optional.
 */
export function missingJobDetail(
  draft: Pick<JobDraft, 'problem' | 'description'>,
  problems: readonly JobProblem[],
): MissingJobDetail {
  const chosen = problems.find((option) => option.key === draft.problem);
  if (!chosen) return 'problem';
  if (chosen.needsDescription && draft.description.trim() === '') return 'description';
  return null;
}
