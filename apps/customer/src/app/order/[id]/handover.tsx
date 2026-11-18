import { useLocalSearchParams, useRouter } from 'expo-router';

import { SAMPLE_HANDOVER, SAMPLE_RECEIVED_AT } from '@/features/tailor/sampleData';
import { HandoverScreen } from '@/features/tailor/screens/HandoverScreen';

// Route "/order/:id/handover": pickup and delivery for a tailor order.
//
// SAMPLE DATA: whatever the id, this shows the runner, code and checklists
// drawn in design/source/Handover.dc.html. For review, `?step=delivery` shows
// the delivery half (default pickup, the design's "Step" tweak); later the
// step comes from the order itself. The pickup code is made on the server.
//
// NOT WIRED YET:
// - "I've received everything" records nothing; it resolves at once with the
//   design's sample time. It becomes a server function in Sprint 2.
export default function HandoverRoute() {
  const router = useRouter();
  const { id, step } = useLocalSearchParams<{ id: string; step?: string }>();
  const backToOrder = () =>
    router.canGoBack()
      ? router.back()
      : router.replace({ pathname: '/order/[id]', params: { id } });
  return (
    <HandoverScreen
      handover={SAMPLE_HANDOVER}
      step={step === 'delivery' ? 'delivery' : 'pickup'}
      onBack={backToOrder}
      onMessage={() => router.push({ pathname: '/job/[id]/chat', params: { id } })}
      onConfirmReceived={async () => ({ receivedAt: SAMPLE_RECEIVED_AT })}
      onReportProblem={() => router.push({ pathname: '/job/[id]/problem', params: { id } })}
      onBackToOrder={backToOrder}
    />
  );
}
