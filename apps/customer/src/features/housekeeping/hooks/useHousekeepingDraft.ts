import { useState } from 'react';

import {
  DEFAULT_DRAFT,
  estimateText,
  missingHousekeepingDetail,
  toHousekeepingRequest,
  toggleItem,
} from '../housekeepingDraft';
import type {
  HelpType,
  HomeSize,
  HousekeepingDraft,
  HousekeepingTask,
  TimeSlot,
  Weekday,
} from '../types';

export type HousekeepingDraftInitial = Partial<HousekeepingDraft>;

/**
 * The housekeeping request being filled in, before it is sent. In memory only
 * for now, like useTailorDraft; sending it is added here with the backend.
 * Defaults are the design's first state.
 */
export function useHousekeepingDraft(initial: HousekeepingDraftInitial = {}) {
  const [draft, setDraft] = useState<HousekeepingDraft>({ ...DEFAULT_DRAFT, ...initial });
  const set = (patch: Partial<HousekeepingDraft>) => setDraft((d) => ({ ...d, ...patch }));

  return {
    ...draft,
    setType: (type: HelpType) => set({ type }),
    toggleTask: (task: HousekeepingTask) =>
      setDraft((d) => ({ ...d, tasks: toggleItem(d.tasks, task) })),
    setSize: (size: HomeSize) => set({ size }),
    toggleDay: (day: Weekday) => setDraft((d) => ({ ...d, days: toggleItem(d.days, day) })),
    setSlot: (slot: TimeSlot) => set({ slot }),
    setHours: (hours: number) => set({ hours }),
    togglePreferWoman: () => setDraft((d) => ({ ...d, preferWoman: !d.preferWoman })),
    toggleTrialDay: () => setDraft((d) => ({ ...d, trialDay: !d.trialDay })),
    /** What is still needed before the request can be sent; null when ready. */
    missing: missingHousekeepingDetail(draft),
    /** The request to send, or null while it is incomplete. */
    request: toHousekeepingRequest(draft),
    estimate: estimateText(draft),
  };
}
