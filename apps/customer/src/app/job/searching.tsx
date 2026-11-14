import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';

import { isJobServiceKey } from '@/features/job/copy';
import { SearchingScreen } from '@/features/job/screens/SearchingScreen';

// Route "/job/searching?service=electrician". The job summary, area and worker
// below are the sample data shown in design/source/Searching.dc.html; in Sprint
// 2 they come from the posted job and the server's worker matching.
export default function SearchingRoute() {
  const router = useRouter();
  const { service } = useLocalSearchParams<{ service?: string }>();

  if (!isJobServiceKey(service)) {
    return <Redirect href="/home" />;
  }

  return (
    <SearchingScreen
      service={service}
      jobSummary="Fan not working · Now"
      area="Anna Nagar"
      worker={{ name: 'Murugan K.', firstName: 'Murugan', detail: '2.1 km away · ★ 4.8 · Level 2' }}
      // Back to Home, closing Describe the job too, as the design's link does.
      // dismissTo pops the stack down to Home instead of pushing a new Home on top.
      onCancel={() => router.dismissTo('/home')}
      // The design links this row to Worker on the way. With a server, that
      // screen opens by itself when a worker accepts (Sprint 2).
      onOpenWorker={() => router.push('/job/tracking')}
    />
  );
}
