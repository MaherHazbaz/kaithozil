import { useLocalSearchParams, useRouter } from 'expo-router';

import { sampleRegularHelp } from '@/features/housekeeping/sampleData';
import { RegularHelpScreen } from '@/features/housekeeping/screens/RegularHelpScreen';

// Route "/help/:id" (an arrangement for regular help). "/help/:id/trial" and
// "/help/:id/leave/:leaveId" live in the help/[id]/ folder next to this file.
//
// SAMPLE DATA: whatever the id, this shows the arrangement drawn in
// design/source/HousekeepingPlan.dc.html. In Sprint 2 it is loaded from
// Supabase by id, with loading, not-found and error states. The pay counts
// (18 days worked, 1 paid leave, 1 absent) are shown as drawn: the server
// counts them from the daily check-in codes. The drawn calendar has 17 worked
// days, so the design's 18 is a question for the owner.
//
// NOT WIRED YET:
// - Pause and Resume resolve at once without telling anyone. They become
//   server functions in Sprint 2 that also notify the housekeeper.
// - PAYMENTS ARE NOT BUILT: "Pay for November" resolves without doing
//   anything. Monthly pay waits on the owner's decision (gateway or direct
//   UPI, CLAUDE.md "Trust rules"). [AMOUNT] and [LEAVE DAYS] are still to be
//   decided.
// - Message, Change days, Report a problem and End this arrangement open the
//   shared Chat, Schedule, Report a problem and Cancel booking screens, which
//   still show their own sample jobs.
export default function RegularHelpRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const helpId = id ?? sampleRegularHelp.id;
  return (
    <RegularHelpScreen
      help={sampleRegularHelp}
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/bookings'))}
      onMessage={() => router.push({ pathname: '/job/[id]/chat', params: { id: helpId } })}
      onOpenLeave={(leaveId) =>
        router.push({ pathname: '/help/[id]/leave/[leaveId]', params: { id: helpId, leaveId } })
      }
      onPay={async () => {}}
      onChangeDays={() => router.push('/job/new/schedule')}
      onPause={async () => {}}
      onResume={async () => {}}
      onReportProblem={() => router.push({ pathname: '/job/[id]/problem', params: { id: helpId } })}
      onEnd={() => router.push({ pathname: '/job/[id]/cancel', params: { id: helpId } })}
    />
  );
}
