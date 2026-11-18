import { useState } from 'react';

import { missingVisitDetail, toggleWork, type VisitDraft } from '../visitRequest';

export type VisitDraftInitial = Partial<VisitDraft>;

/** The visit request being filled in. In memory only until the backend exists (Sprint 2). */
export function useVisitDraft(defaultDuration: string, initial: VisitDraftInitial = {}) {
  const [work, setWork] = useState<readonly string[]>(initial.work ?? []);
  const [size, setSize] = useState<string | null>(initial.size ?? null);
  const [duration, setDuration] = useState(initial.duration ?? defaultDuration);

  return {
    work,
    size,
    duration,
    toggleWork: (key: string) => setWork((current) => toggleWork(current, key)),
    setSize,
    setDuration,
    /** What is still needed before the visit can be requested; null when ready. */
    missing: missingVisitDetail({ work, size }),
  };
}
