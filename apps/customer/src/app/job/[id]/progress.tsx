import { useLocalSearchParams, useRouter } from 'expo-router';

import { sampleProgress } from '@/features/quote/sampleData';
import { JobProgressScreen } from '@/features/quote/screens/JobProgressScreen';

// Route "/job/:id/progress": a job that runs over several days.
//
// SAMPLE DATA: whatever the id, this shows the job drawn in
// design/source/JobProgress.dc.html. In Sprint 2 the daily updates and photos
// come from the worker app through Supabase.
//
// NOT WIRED YET:
// - "Paid · verified" is sample text. A stage is paid only when the
//   customer's "Paid" and the worker's "Received" are both confirmed by a
//   server function (CLAUDE.md "Trust rules"); how the customer pays each
//   stage waits on the owner's payments decision.
export default function JobProgressRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const jobId = id ?? sampleProgress.jobId;
  return (
    <JobProgressScreen
      progress={sampleProgress}
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/bookings'))}
      onMessage={() => router.push({ pathname: '/job/[id]/chat', params: { id: jobId } })}
      onChanges={() => router.push({ pathname: '/job/[id]/change', params: { id: jobId } })}
      onReportProblem={() => router.push({ pathname: '/job/[id]/problem', params: { id: jobId } })}
    />
  );
}
