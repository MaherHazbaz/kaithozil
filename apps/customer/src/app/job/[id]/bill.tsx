import { useLocalSearchParams, useRouter } from 'expo-router';

import { sampleBill } from '@/features/bill/sampleData';
import { BillScreen } from '@/features/bill/screens/BillScreen';

// Route "/job/:id/bill": the worker has finished; the customer checks the
// bill before paying (Worker on the way → Check the bill → Pay and rate →
// Job receipt).
//
// SAMPLE DATA: whatever the id, this shows the bill drawn in
// design/source/BillApprove.dc.html. In Sprint 2 the bill and photos come
// from the server by job id, with loading, not-found and error states.
//
// NOT WIRED YET:
// - "Looks right, pay …" records nothing; it only opens Pay and rate. Saving
//   the customer's approval becomes a server function in Sprint 2.
export default function BillRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const jobId = id ?? sampleBill.jobId;
  return (
    <BillScreen
      bill={sampleBill}
      // Opened by a deep link there is nothing to go back to, so go to Bookings.
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/bookings'))}
      onApprove={async () => {
        router.push({ pathname: '/job/[id]/pay', params: { id: jobId } });
      }}
      onReportProblem={() => router.push({ pathname: '/job/[id]/problem', params: { id: jobId } })}
    />
  );
}
