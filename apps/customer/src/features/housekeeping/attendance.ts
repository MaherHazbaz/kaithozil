import type { AttendanceMonth, AttendanceStatus } from './types';

/** One calendar cell: a day of the month, or an empty cell before day 1 / after the last day. */
export type CalendarCell = { day: number; status: AttendanceStatus } | null;

/**
 * The month as weeks of 7 cells, Sunday first (the design's S M T W T F S
 * header). Empty cells pad the first and last week so every row has 7.
 *
 * WHY weeks rather than one list: React Native has no CSS grid. Rows of 7
 * equal flex cells give the design's `repeat(7, 1fr)` without measuring the
 * screen width.
 */
export function calendarWeeks(month: AttendanceMonth): CalendarCell[][] {
  const daysInMonth = new Date(month.year, month.monthIndex + 1, 0).getDate();
  if (month.days.length !== daysInMonth) {
    throw new RangeError(`Expected ${daysInMonth} days, got ${month.days.length}`);
  }
  const leading = new Date(month.year, month.monthIndex, 1).getDay();
  const cells: CalendarCell[] = [
    ...Array.from({ length: leading }, () => null),
    ...month.days.map((status, i) => ({ day: i + 1, status })),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: CalendarCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}
