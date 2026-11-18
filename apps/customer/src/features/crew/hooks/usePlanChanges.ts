import { useState } from 'react';

import { CREW_DAYS, totalWorkers, withRoleCount } from '../crewPlan';
import type { CrewRole, JobPlan, PlanChanges } from '../types';

const fromPlan = (plan: JobPlan): PlanChanges => ({
  counts: plan.counts,
  days: plan.days,
  message: '',
});

/**
 * The customer's counter-proposal on Job plan ("Suggest changes"). It starts
 * from the mestri's plan and changes nothing on the server until it is sent
 * and the mestri accepts it. Cancel throws the draft away, so reopening
 * "Suggest changes" starts from the plan again.
 */
export function usePlanChanges(plan: JobPlan) {
  const [draft, setDraft] = useState<PlanChanges>(() => fromPlan(plan));

  return {
    draft,
    /** A plan with nobody in it cannot be worked, so it cannot be sent. */
    canSend: totalWorkers(draft.counts) > 0,
    setRoleCount: (role: CrewRole, count: number) =>
      setDraft((d) => ({ ...d, counts: withRoleCount(d.counts, role, count) })),
    setDays: (days: number) =>
      setDraft((d) => ({ ...d, days: Math.min(CREW_DAYS.max, Math.max(CREW_DAYS.min, days)) })),
    setMessage: (message: string) => setDraft((d) => ({ ...d, message })),
    reset: () => setDraft(fromPlan(plan)),
  };
}
