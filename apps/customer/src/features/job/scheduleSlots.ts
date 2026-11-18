import { scheduleCopy } from './copy';

/** Start hour (24-hour clock) of each 2-hour booking window, as drawn in Schedule.dc.html. */
export const SLOT_STARTS = [8, 10, 12, 14, 16, 18] as const;
export type SlotStart = (typeof SLOT_STARTS)[number];

export type DayPart = 'morning' | 'afternoon' | 'evening';
export const DAY_PARTS: readonly DayPart[] = ['morning', 'afternoon', 'evening'];

/** How many days, starting today, the customer can book. */
export const BOOKING_DAYS = 7;

/**
 * A worker needs time to finish their current job and travel, so a window
 * that starts sooner than this cannot be booked (Schedule.dc.html: "Book at
 * least 2 hours ahead").
 */
export const MIN_NOTICE_HOURS = 2;

const HOUR_MS = 60 * 60 * 1000;

export type SlotAvailability = 'available' | 'passed' | 'full';

/** A window with no worker free, as the server will report it. `date` is local "YYYY-MM-DD". */
export type FullSlot = { date: string; start: SlotStart };

export function dayPartOf(start: SlotStart): DayPart {
  if (start < 12) return 'morning';
  if (start < 16) return 'afternoon';
  return 'evening';
}

/** Local midnight `offset` days after `now`. */
export function bookingDay(now: Date, offset: number): Date {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
}

/** Local calendar date as "YYYY-MM-DD", the key used for full slots. */
export function dateKey(day: Date): string {
  const month = String(day.getMonth() + 1).padStart(2, '0');
  const date = String(day.getDate()).padStart(2, '0');
  return `${day.getFullYear()}-${month}-${date}`;
}

/**
 * Whether a window can still be booked.
 *
 * "Passed" wins over "full": a window that is too soon is unavailable whatever
 * the server says. The notice is measured to the minute, so at 8:30 the
 * 10 AM window (90 minutes away) is passed. (The design's sample script
 * compares whole hours only and would still offer it.)
 */
export function slotAvailability(
  day: Date,
  start: SlotStart,
  now: Date,
  fullSlots: readonly FullSlot[],
): SlotAvailability {
  const startsAt = new Date(day.getFullYear(), day.getMonth(), day.getDate(), start);
  if (startsAt.getTime() - now.getTime() < MIN_NOTICE_HOURS * HOUR_MS) return 'passed';
  const key = dateKey(day);
  if (fullSlots.some((slot) => slot.date === key && slot.start === start)) return 'full';
  return 'available';
}

export type DayLabels = {
  /** First line of the day chip: "Today", "Tmrw" or "Fri". */
  top: string;
  /** Day of the month. */
  num: string;
  /** Tamil weekday under the number. */
  tamil: string;
  /** "Tomorrow 19 Nov": the footer summary and the chip's spoken name. */
  long: string;
};

export function dayLabels(day: Date, offset: number): DayLabels {
  const weekday = scheduleCopy.weekdays[day.getDay()] ?? '';
  const name = offset === 0 ? scheduleCopy.today : offset === 1 ? scheduleCopy.tomorrow : weekday;
  return {
    top: offset === 0 ? scheduleCopy.today : offset === 1 ? scheduleCopy.tomorrowShort : weekday,
    num: String(day.getDate()),
    tamil: scheduleCopy.weekdaysTamil[day.getDay()] ?? '',
    long: `${name} ${day.getDate()} ${scheduleCopy.months[day.getMonth()] ?? ''}`,
  };
}
