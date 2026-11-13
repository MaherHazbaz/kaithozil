import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';

import { isJobServiceKey } from '@/features/job/copy';
import { DescribeJobScreen } from '@/features/job/screens/DescribeJobScreen';

// Route "/job/new?service=electrician". The address and estimate below are the
// sample data shown in design/source/Post.dc.html; they are replaced by real
// data from Supabase in Sprint 2. Add photo, Voice note, Change and the main
// button are wired as the screens they lead to are built.
export default function DescribeJobRoute() {
  const router = useRouter();
  const { service } = useLocalSearchParams<{ service?: string }>();

  // A deep link can carry any text. Anything that is not a service this
  // screen is ready for goes back to Home rather than rendering half a screen.
  if (!isJobServiceKey(service)) {
    return <Redirect href="/home" />;
  }

  return (
    <DescribeJobScreen
      service={service}
      address={{ label: 'Home', line: '12, 4th Street, Anna Nagar' }}
      estimateRange="₹400 – 700"
      // Opened by a deep link there is nothing to go back to, so go to Home.
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/home'))}
    />
  );
}
