import { useLocalSearchParams, useRouter } from 'expo-router';

import {
  sampleDispute,
  sampleDisputeJob,
  sampleSettlementTerms,
} from '@/features/dispute/sampleData';
import { SettlementScreen } from '@/features/dispute/screens/SettlementScreen';

// Route "/job/:id/problem/settle": the customer offers what's fair to pay.
//
// SAMPLE DATA: whatever the id, this shows the figures drawn in
// design/source/Settlement.dc.html. In Sprint 2 they come from the server
// (with loading, not-found and error states); the server owns every amount,
// and the screen's arithmetic only decides what is shown.
//
// NOT WIRED YET:
// - Sending the offer and asking for a review resolve at once and tell no
//   one. Both become server functions; the step (offer sent, agreed) then
//   comes from the server, including the worker's answer.
// - PAYMENTS ARE NOT BUILT: "Pay ₹…" resolves without doing anything. How the
//   customer pays (gateway or direct UPI) waits on the owner's decision
//   (CLAUDE.md "Trust rules"). A settlement is paid only when the server
//   confirms it.
export default function SettlementRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const jobId = id ?? sampleDisputeJob.jobId;
  return (
    <SettlementScreen
      job={sampleDisputeJob}
      terms={sampleSettlementTerms}
      onBack={() =>
        router.canGoBack()
          ? router.back()
          : router.replace({ pathname: '/job/[id]/problem/work', params: { id: jobId } })
      }
      onSendOffer={async () => {}}
      onAskReview={async () => {}}
      onReviewOpened={() =>
        router.push({ pathname: '/dispute/[id]', params: { id: sampleDispute.caseId } })
      }
      onPay={async () => {}}
    />
  );
}
