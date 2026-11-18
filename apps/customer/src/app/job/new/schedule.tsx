import { useRouter } from 'expo-router';
import { useState } from 'react';

import { SLOT_STARTS, bookingDay, dateKey, type FullSlot } from '@/features/job/scheduleSlots';
import { ScheduleScreen } from '@/features/job/screens/ScheduleScreen';

// Route "/job/new/schedule". Starts on the design's sample choice (tomorrow,
// 10 AM – 12 PM), and the full windows follow the design's sample pattern
// (design/source/Schedule.dc.html script).
//
// NOT WIRED YET: which windows are full comes from the server's worker
// availability (Sprint 2), and the confirmed time is not yet carried back to
// the job being described (needs a shared job draft).
export default function ScheduleRoute() {
  const router = useRouter();
  // Read once when the screen opens, so the windows do not change under the
  // customer's finger while they choose.
  const [now] = useState(() => new Date());
  const back = () => (router.canGoBack() ? router.back() : router.replace('/home'));
  return (
    <ScheduleScreen
      now={now}
      fullSlots={designSampleFullSlots(now)}
      initial={{ dayOffset: 1, start: 10 }}
      onBack={back}
      onConfirm={back}
    />
  );
}

// The design's stand-in for "no workers free": day i, window k is full when
// (i * 3 + k) % 7 === 5.
function designSampleFullSlots(now: Date): FullSlot[] {
  return Array.from({ length: 7 }, (_, offset) => bookingDay(now, offset)).flatMap((day, offset) =>
    SLOT_STARTS.filter((_, k) => (offset * 3 + k) % 7 === 5).map((start) => ({
      date: dateKey(day),
      start,
    })),
  );
}
