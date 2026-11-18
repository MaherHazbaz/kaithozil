import { useMemo, useState } from 'react';

import { agreedCount, donePercent } from '../disputeMoney';
import type { Mark, Milestone } from '../types';

/**
 * The customer's marking on Record the work done, and the totals the footer
 * shows. Marks are kept in the plan's order, one per milestone; a milestone
 * not marked yet counts as "Not done".
 */
export function useWorkRecord(milestones: readonly Milestone[], initialMarks: readonly Mark[]) {
  const [marks, setMarks] = useState<readonly Mark[]>(() =>
    milestones.map((_, index) => initialMarks[index] ?? 'notDone'),
  );

  const setMark = (index: number, mark: Mark) =>
    setMarks((current) => current.map((value, i) => (i === index ? mark : value)));

  // The other side's marking only changes when the server sends a new plan.
  const otherPercent = useMemo(
    () =>
      donePercent(
        milestones,
        milestones.map((milestone) => milestone.otherMark),
      ),
    [milestones],
  );

  return {
    marks,
    setMark,
    myPercent: donePercent(milestones, marks),
    otherPercent,
    agreed: agreedCount(milestones, marks),
  };
}
