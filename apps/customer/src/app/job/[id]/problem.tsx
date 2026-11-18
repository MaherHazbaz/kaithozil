import { useLocalSearchParams, useRouter } from 'expo-router';

import { sampleDisputeJob } from '@/features/dispute/sampleData';
import { ReportProblemScreen } from '@/features/dispute/screens/ReportProblemScreen';

// Route "/job/:id/problem". Its next steps live in the problem/ folder next to
// this file ("/job/:id/problem/work", "/job/:id/problem/settle").
//
// SAMPLE DATA: whatever the id, this shows the job drawn in
// design/source/ReportProblem.dc.html. In Sprint 2 the job is loaded from
// Supabase by id (with loading, not-found and error states).
//
// NOT WIRED YET:
// - Reporting resolves at once and pauses nothing. It becomes a server
//   function that opens the case and pauses the job and any payments in one
//   transaction, and tells the worker.
// - "Add photos" needs expo-image-picker (not installed). Evidence photos go
//   to Supabase Storage, time-stamped, with the job.
// - "I feel unsafe" opens Safety, whose call button waits for [SAFETY NUMBER]
//   (the design links it to Support).
export default function ReportProblemRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const jobId = id ?? sampleDisputeJob.jobId;
  return (
    <ReportProblemScreen
      job={sampleDisputeJob}
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/bookings'))}
      onUnsafe={() => router.push('/safety')}
      onReport={async () => {}}
      onRecordWork={() =>
        router.push({ pathname: '/job/[id]/problem/work', params: { id: jobId } })
      }
      onTalk={() => router.push({ pathname: '/job/[id]/chat', params: { id: jobId } })}
    />
  );
}
