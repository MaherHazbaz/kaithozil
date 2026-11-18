import { useRouter } from 'expo-router';

import { sampleDispute } from '@/features/dispute/sampleData';
import { DisputeStatusScreen } from '@/features/dispute/screens/DisputeStatusScreen';

// Route "/dispute/:id", e.g. "/dispute/D-0312".
//
// SAMPLE DATA: whatever the id, this shows the case under review drawn in
// design/source/DisputeStatus.dc.html (`sampleDecidedDispute` is the
// "Decision made" stage). In Sprint 2 the case is loaded from Supabase by id
// (with loading, not-found and error states) and the stage follows the
// reviewer's decision.
//
// NOT WIRED YET:
// - "Message the reviewer" and the appeal open the case's support ticket,
//   which still shows the sample ticket. Appeals become a server function.
// - PAYMENTS ARE NOT BUILT: "Pay ₹… and close the job" resolves without doing
//   anything. How the customer pays (gateway or direct UPI) waits on the
//   owner's decision (CLAUDE.md "Trust rules").
// - "within [X] days" is a placeholder for the review time, still to decide.
export default function DisputeStatusRoute() {
  const router = useRouter();
  const openTicket = () =>
    router.push({ pathname: '/support/[id]', params: { id: sampleDispute.ticketId } });
  return (
    <DisputeStatusScreen
      dispute={sampleDispute}
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/bookings'))}
      onMessageReviewer={openTicket}
      onPay={async () => {}}
      onAppeal={openTicket}
    />
  );
}
