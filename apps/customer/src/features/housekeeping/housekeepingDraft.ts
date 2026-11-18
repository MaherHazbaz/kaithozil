import { bookCopy } from './copy';
import type { HousekeepingDraft, MissingHousekeepingDetail } from './types';

/** The design's stepper limits (HousekeepingBook.dc.html script: 1 to 8 hours). */
export const MIN_HOURS = 1;
export const MAX_HOURS = 8;

/** The design's first state: regular help, sweeping and dishes, 2 BHK, Mon – Sat, 6 – 8 AM, 2 h. */
export const DEFAULT_DRAFT: HousekeepingDraft = {
  type: 'regular',
  tasks: ['sweeping', 'dishes'],
  size: 'twoBhk',
  days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
  slot: 'six',
  hours: 2,
  preferWoman: true,
  trialDay: true,
};

/** Adds the item when absent and removes it when present (multi-choice chips). */
export function toggleItem<T>(list: readonly T[], item: T): readonly T[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}

/**
 * What still has to be chosen, or null.
 *
 * WHY tasks come before days: the design checks them in that order, and days
 * only matter for regular help (a one-time cleaning has no days to choose).
 */
export function missingHousekeepingDetail(
  draft: Pick<HousekeepingDraft, 'type' | 'tasks' | 'days'>,
): MissingHousekeepingDetail {
  if (draft.tasks.length === 0) return 'tasks';
  if (draft.type === 'regular' && draft.days.length === 0) return 'days';
  return null;
}

/**
 * The draft as it would be sent, or null while it is incomplete or out of
 * range. A one-time cleaning drops the regular-only choices (days, trial day)
 * so the server never sees settings the customer could not see.
 */
export function toHousekeepingRequest(draft: HousekeepingDraft): HousekeepingDraft | null {
  if (missingHousekeepingDetail(draft) !== null) return null;
  if (!Number.isInteger(draft.hours) || draft.hours < MIN_HOURS || draft.hours > MAX_HOURS) {
    return null;
  }
  if (draft.type === 'oneTime') return { ...draft, days: [], trialDay: false };
  return draft;
}

/** The estimate card's two lines. Rates are not decided, so the amount stays a placeholder. */
export function estimateText(draft: HousekeepingDraft): { amount: string; detail: string } {
  if (draft.type === 'regular') {
    return {
      amount: bookCopy.estimateRegular,
      detail: bookCopy.estimateRegularSub(draft.days.length, draft.hours),
    };
  }
  const size = bookCopy.sizes.find((s) => s.key === draft.size)?.label ?? '';
  return {
    amount: bookCopy.estimateOneTime,
    detail: bookCopy.estimateOneTimeSub(size, draft.hours),
  };
}
