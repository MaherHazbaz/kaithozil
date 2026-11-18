import { useState } from 'react';

import { scheduleCopy } from '../copy';
import {
  BOOKING_DAYS,
  SLOT_STARTS,
  bookingDay,
  dateKey,
  dayLabels,
  slotAvailability,
  type FullSlot,
  type SlotStart,
} from '../scheduleSlots';

export type ScheduleChoiceInitial = {
  /** 0 = today. */
  dayOffset: number;
  start: SlotStart | null;
};

/** The confirmed window: local date "YYYY-MM-DD" and start hour. */
export type ScheduledTime = { date: string; start: SlotStart };

/**
 * The day and window the customer is choosing on Schedule a time.
 *
 * Availability is worked out again on every render from `now`, so a window
 * that has become too soon is never offered, even if it was chosen earlier.
 */
export function useScheduleChoice(
  now: Date,
  fullSlots: readonly FullSlot[],
  initial: ScheduleChoiceInitial = { dayOffset: 0, start: null },
) {
  const [dayOffset, setDayOffset] = useState(initial.dayOffset);
  const [start, setStart] = useState<SlotStart | null>(initial.start);

  const days = Array.from({ length: BOOKING_DAYS }, (_, offset) => {
    const day = bookingDay(now, offset);
    return { offset, day, labels: dayLabels(day, offset) };
  });
  const selectedDay = bookingDay(now, dayOffset);
  const slots = SLOT_STARTS.map((slotStart) => ({
    start: slotStart,
    availability: slotAvailability(selectedDay, slotStart, now, fullSlots),
  }));

  const chosen =
    start !== null && slotAvailability(selectedDay, start, now, fullSlots) === 'available'
      ? { date: dateKey(selectedDay), start }
      : null;

  return {
    days,
    dayOffset,
    slots,
    start,
    /** The window to confirm, or null while none (or an unavailable one) is chosen. */
    chosen,
    summary: chosen
      ? `${dayLabels(selectedDay, dayOffset).long} · ${scheduleCopy.slots[chosen.start]}`
      : scheduleCopy.noTime,
    // A new day has different windows free, so the window choice starts over (as designed).
    pickDay: (offset: number) => {
      setDayOffset(offset);
      setStart(null);
    },
    pickSlot: setStart,
  };
}
