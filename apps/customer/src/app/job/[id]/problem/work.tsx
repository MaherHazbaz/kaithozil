import { useLocalSearchParams, useRouter } from 'expo-router';

import { sampleDisputeJob, sampleMarks, sampleMilestones } from '@/features/dispute/sampleData';
import { WorkRecordScreen } from '@/features/dispute/screens/WorkRecordScreen';

// Route "/job/:id/problem/work": both sides mark how far each part of the
// agreed plan got.
//
// SAMPLE DATA: whatever the id, this shows the plan and the worker's marking
// drawn in design/source/WorkRecord.dc.html. In Sprint 2 they are loaded from
// Supabase by job id (with loading, not-found and error states), and the
// worker's marking updates live as he changes it.
//
// NOT WIRED YET: saving the customer's marks resolves at once and records
// nothing. The server recalculates the percent from the marks; the one shown
// here is only for the screen.
export default function WorkRecordRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const jobId = id ?? sampleDisputeJob.jobId;
  return (
    <WorkRecordScreen
      job={sampleDisputeJob}
      milestones={sampleMilestones}
      initialMarks={sampleMarks}
      onBack={() =>
        router.canGoBack()
          ? router.back()
          : router.replace({ pathname: '/job/[id]/problem', params: { id: jobId } })
      }
      onSave={async () => {}}
      onSaved={() => router.push({ pathname: '/job/[id]/problem/settle', params: { id: jobId } })}
    />
  );
}
