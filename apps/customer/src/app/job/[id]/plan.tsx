import { useRouter } from 'expo-router';

import { sampleJobPlan } from '@/features/crew/sampleData';
import { JobPlanScreen } from '@/features/crew/screens/JobPlanScreen';

// Route "/job/:id/plan": the job plan a mestri proposes when the customer
// chose "Not sure how many workers or days?" on Book construction crew.
//
// SAMPLE DATA: whatever the id, this shows the plan drawn in
// design/source/JobPlan.dc.html. In Sprint 2 the plan is loaded from Supabase
// by id (with loading, not-found and error states) and updates in real time
// when the mestri answers.
//
// NOT WIRED YET:
// - "Confirm plan" resolves at once with the design's sample time. It becomes
//   a server function that records both confirmations in one transaction.
// - "Send changes" resolves at once and tells nobody.
export default function JobPlanRoute() {
  const router = useRouter();
  return (
    <JobPlanScreen
      plan={sampleJobPlan}
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/bookings'))}
      onConfirm={async () => ({ confirmedAt: '4:10 PM' })}
      onSendChanges={async () => {}}
      onGoToBookings={() => router.replace('/bookings')}
      onSeeCrew={() =>
        router.push({ pathname: '/crew/[id]', params: { id: sampleJobPlan.crewId } })
      }
    />
  );
}
