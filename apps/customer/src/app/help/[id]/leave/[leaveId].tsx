import { useLocalSearchParams, useRouter } from 'expo-router';

import { sampleHousekeeper, sampleLeave } from '@/features/housekeeping/sampleData';
import { LeaveApproveScreen } from '@/features/housekeeping/screens/LeaveApproveScreen';

// Route "/help/:id/leave/:leaveId".
//
// SAMPLE DATA: whatever the ids, this shows the request drawn in
// design/source/LeaveApprove.dc.html. In Sprint 2 it is loaded from Supabase,
// with loading, not-found, already-answered and error states.
//
// NOT WIRED YET:
// - Approve and Decline resolve at once without telling anyone. They become
//   server functions (Sprint 2) that answer the request once and notify the
//   housekeeper; "Find someone to cover" then books a verified housekeeper.
// - Paying the cover housekeeper waits on the owner's payment decision
//   (gateway or direct UPI, CLAUDE.md "Trust rules").
export default function LeaveApproveRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const toPlan = () =>
    router.canGoBack()
      ? router.back()
      : router.replace({ pathname: '/help/[id]', params: { id: id ?? 'help-1' } });
  return (
    <LeaveApproveScreen
      housekeeper={sampleHousekeeper}
      leave={sampleLeave}
      onBack={toPlan}
      onApprove={async () => {}}
      onDecline={async () => {}}
      onMessage={() => router.push({ pathname: '/job/[id]/chat', params: { id: id ?? 'help-1' } })}
      onDone={toPlan}
    />
  );
}
