import { useRouter } from 'expo-router';

import { sampleRegularHelp } from '@/features/housekeeping/sampleData';
import { HousekeepingBookScreen } from '@/features/housekeeping/screens/HousekeepingBookScreen';

// Route "/job/new/housekeeping". Starts on the design's first state
// (design/source/HousekeepingBook.dc.html).
//
// SAMPLE DATA: "Manage it" opens the sample regular help. In Sprint 2 it opens
// the customer's own arrangement (and is hidden when they have none).
//
// NOT WIRED YET:
// - "Find housekeepers" / "Book a cleaning" send nothing. The design leads to
//   Finding a worker, but that screen only has approved wording for
//   electricians (features/job/copy.ts), so the button does nothing until the
//   owner approves "Finding a housekeeper" wording and the request is sent to
//   the server (Sprint 2).
// - [MONTHLY RATE] and [VISIT RATE] are still to be decided.
// - PAYMENTS ARE NOT BUILT: monthly pay waits on the owner's decision (gateway
//   or direct UPI, CLAUDE.md "Trust rules").
export default function HousekeepingBookRoute() {
  const router = useRouter();
  return (
    <HousekeepingBookScreen
      // Opened by a deep link there is nothing to go back to, so go to Home.
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/home'))}
      onManage={() => router.push({ pathname: '/help/[id]', params: { id: sampleRegularHelp.id } })}
    />
  );
}
