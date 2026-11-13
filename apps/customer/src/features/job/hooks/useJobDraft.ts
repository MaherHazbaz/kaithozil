import { useState } from 'react';

import { missingJobDetail, type JobDraft, type JobProblem, type JobTiming } from '../jobDraft';

export type JobDraftInitial = Partial<JobDraft>;

/**
 * The job the customer is describing, before it is sent.
 *
 * It lives in memory only for now. When the backend arrives, sending the draft
 * is added here and the screen does not change.
 */
export function useJobDraft(problems: readonly JobProblem[], initial: JobDraftInitial = {}) {
  const [problem, setProblem] = useState<string | null>(initial.problem ?? null);
  const [description, setDescription] = useState(initial.description ?? '');
  const [timing, setTiming] = useState<JobTiming>(initial.timing ?? 'now');

  return {
    problem,
    description,
    timing,
    setProblem,
    setDescription,
    setTiming,
    /** What is still needed before the job can be sent; null when ready. */
    missing: missingJobDetail({ problem, description }, problems),
  };
}
