import { useLocalSearchParams, useRouter } from 'expo-router';

import { sampleChangeJob, sampleChangeProposal } from '@/features/quote/sampleData';
import { ChangeRequestScreen } from '@/features/quote/screens/ChangeRequestScreen';

// Route "/job/:id/change": the customer answers the worker's request for
// extra work. "?side=worker" shows the worker's half of the shared design
// (propose, then wait), which moves to the worker app in Sprint 2; it is here
// so the design's default screenshot can be compared.
//
// SAMPLE DATA: whatever the id, this shows the request drawn in
// design/source/ChangeRequest.dc.html.
//
// NOT WIRED YET: approving, declining and sending go nowhere. In Sprint 2
// each is a server function, and the new total applies only once both sides
// have accepted. Adding a photo needs expo-image-picker (not installed).
export default function ChangeRequestRoute() {
  const router = useRouter();
  const { id, side } = useLocalSearchParams<{ id: string; side?: string }>();
  const jobId = id ?? 'KT-20481';
  const back = () =>
    router.canGoBack()
      ? router.back()
      : router.replace({ pathname: '/job/[id]/progress', params: { id: jobId } });

  if (side === 'worker') {
    return (
      <ChangeRequestScreen
        side="worker"
        job={sampleChangeJob}
        onBack={back}
        onBackToJob={back}
        onPropose={async () => {}}
      />
    );
  }
  return (
    <ChangeRequestScreen
      side="customer"
      job={sampleChangeJob}
      proposal={sampleChangeProposal}
      onBack={back}
      onBackToJob={back}
      onAsk={() => router.push({ pathname: '/job/[id]/chat', params: { id: jobId } })}
      // The server records the time; the design's sample time stands in.
      onApprove={async () => ({ approvedAt: '4:44 PM' })}
      onDecline={async () => {}}
    />
  );
}
