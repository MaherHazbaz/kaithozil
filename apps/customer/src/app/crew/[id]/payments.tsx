import { useLocalSearchParams, useRouter } from 'expo-router';

import { sampleCrewPayments } from '@/features/crew/sampleData';
import { CrewPaymentsScreen } from '@/features/crew/screens/CrewPaymentsScreen';

// Route "/crew/:id/payments": Daily crew payments, reached from Your crew.
//
// SAMPLE DATA: whatever the id, this shows the days drawn in
// design/source/CrewPayments.dc.html. In Sprint 2 attendance comes from the
// mestri's daily site photo (worker app) through Supabase, and the server
// works out each day's amount from it.
//
// NOT WIRED YET:
// - PAYMENTS ARE NOT BUILT. They wait on the owner's decision: design v3 pays
//   through a payment gateway ([PAYMENT PARTNER]), while CLAUDE.md "Trust
//   rules" says direct UPI with no gateway. "Pay for Wed 19 Nov" resolves at
//   once: no payment SDK, gateway or `upi://` link is called, no money moves
//   and nothing is recorded. A day turns "Paid ✓" only when the server has
//   recorded it (customer's "Paid" and the workers' "Received").
// - Splitting one payment into each worker's share needs the same decision.
// - Every amount stays a placeholder ([PAID SO FAR], [DAY TOTAL], [RATE])
//   until the daily rates are decided.
export default function CrewPaymentsRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const crewId = id ?? sampleCrewPayments.crewId;
  return (
    <CrewPaymentsScreen
      payments={sampleCrewPayments}
      onBack={() =>
        router.canGoBack()
          ? router.back()
          : router.replace({ pathname: '/crew/[id]', params: { id: crewId } })
      }
      onPayDay={async () => {}}
      onReport={() => router.push({ pathname: '/job/[id]/problem', params: { id: crewId } })}
    />
  );
}
