import { useState } from 'react';

import { CREW_DAYS, totalWorkers, withRoleCount, workerDays } from '../crewPlan';
import type { CrewRequest, CrewRole, WorkType } from '../types';

/**
 * The choices on Book construction crew (Crew.dc.html) and what follows from
 * them. The screen only renders; the rules (limits, totals) live here and in
 * crewPlan.ts.
 */
export function useCrewRequest(initial: CrewRequest) {
  const [request, setRequest] = useState<CrewRequest>(initial);

  const total = totalWorkers(request.counts);

  return {
    request,
    total,
    workerDays: workerDays(request.counts, request.days),
    /** "Find 0 workers" would send nobody, so the button waits for one worker. */
    canFind: total > 0,
    setWork: (work: WorkType) => setRequest((r) => ({ ...r, work })),
    setRoleCount: (role: CrewRole, count: number) =>
      setRequest((r) => ({ ...r, counts: withRoleCount(r.counts, role, count) })),
    setDays: (days: number) =>
      setRequest((r) => ({
        ...r,
        days: Math.min(CREW_DAYS.max, Math.max(CREW_DAYS.min, days)),
      })),
    toggleMestri: () => setRequest((r) => ({ ...r, withMestri: !r.withMestri })),
    toggleUnsure: () => setRequest((r) => ({ ...r, unsure: !r.unsure })),
  };
}
