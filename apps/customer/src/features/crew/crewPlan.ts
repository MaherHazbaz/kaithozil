// Counting for construction crews: workers, days and worker-days. No money is
// calculated here on purpose: every rate and total on these screens is still a
// placeholder ([DAILY RATE], [RATE], [DAY TOTAL], [PAID SO FAR]), and the
// server owns the amounts once the rates are decided.

import type { CrewDay, CrewRole, RoleCounts } from './types';

/** The order roles are listed in everywhere (Crew.dc.html). */
export const CREW_ROLES: readonly CrewRole[] = ['mason', 'heavyHelper', 'siteHelper'];

/** Limits from the design's steppers (Crew.dc.html, JobPlan.dc.html). */
export const WORKERS_PER_ROLE = { min: 0, max: 20 } as const;
export const CREW_DAYS = { min: 1, max: 60 } as const;

/** Everyone in the crew. */
export function totalWorkers(counts: RoleCounts): number {
  return CREW_ROLES.reduce((sum, role) => sum + counts[role], 0);
}

/** "35 worker-days": what the customer books, and pays for day by day. */
export function workerDays(counts: RoleCounts, days: number): number {
  return totalWorkers(counts) * days;
}

/** A new count for one role, kept inside the stepper's limits. */
export function withRoleCount(counts: RoleCounts, role: CrewRole, count: number): RoleCounts {
  const clamped = Math.min(WORKERS_PER_ROLE.max, Math.max(WORKERS_PER_ROLE.min, count));
  return { ...counts, [role]: clamped };
}

/**
 * Width of the "2 of 6 days paid" bar, in whole percent. Rounded down, so the
 * bar never looks finished before the last day is paid.
 */
export function paidPercent(paidDays: number, totalDays: number): number {
  if (totalDays <= 0) return 0;
  const clamped = Math.min(Math.max(paidDays, 0), totalDays);
  return Math.floor((clamped * 100) / totalDays);
}

/** Half-day units as the design writes them: 4 -> "2", 3 -> "1.5". */
export function formatHalfDays(halfDays: number): string {
  const whole = Math.floor(halfDays / 2);
  return halfDays % 2 === 0 ? String(whole) : `${whole}.5`;
}

/**
 * The day that opens first on Daily payments: the one due now, else none.
 * (The design opens Wed 19 Nov, the day that is due today.)
 */
export function firstDueDay(days: readonly CrewDay[]): CrewDay | undefined {
  return days.find((day) => day.status === 'due');
}
