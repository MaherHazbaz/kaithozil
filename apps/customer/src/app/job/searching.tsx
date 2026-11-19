import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';

import { isSearchingServiceKey } from '@/features/job/copy';
import { SearchingScreen } from '@/features/job/screens/SearchingScreen';

// The job line in design/source/Searching.dc.html, used when none is passed.
const SAMPLE_SUMMARY = 'Fan not working · Now';
// Longer text did not come from our own forms; fall back rather than show it.
const MAX_SUMMARY_LENGTH = 120;

// Route "/job/searching?service=electrician". Mechanic job and Housekeeping
// also pass `summary`, built from what the customer chose. The area and worker
// below are the sample data shown in design/source/Searching.dc.html; in Sprint
// 2 they come from the posted job and the server's worker matching.
export default function SearchingRoute() {
  const router = useRouter();
  const { service, summary } = useLocalSearchParams<{ service?: string; summary?: string }>();

  if (!isSearchingServiceKey(service)) {
    return <Redirect href="/home" />;
  }

  return (
    <SearchingScreen
      service={service}
      jobSummary={summary && summary.length <= MAX_SUMMARY_LENGTH ? summary : SAMPLE_SUMMARY}
      area="Anna Nagar"
      worker={{ name: 'Murugan K.', firstName: 'Murugan', detail: '2.1 km away · ★ 4.8 · Level 2' }}
      // Back to Home, closing the booking form too, as the design's link does.
      // dismissTo pops the stack down to Home instead of pushing a new Home on top.
      onCancel={() => router.dismissTo('/home')}
      // The design links this row to Worker on the way. With a server, that
      // screen opens by itself when a worker accepts (Sprint 2).
      onOpenWorker={() => router.push('/job/tracking')}
    />
  );
}
