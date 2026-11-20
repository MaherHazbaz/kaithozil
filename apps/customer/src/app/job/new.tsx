import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';

import { useBookingAddress } from '@/features/addresses/hooks/useAddressBook';
import { isJobServiceKey } from '@/features/job/copy';
import { DescribeJobScreen } from '@/features/job/screens/DescribeJobScreen';

// Route "/job/new?service=electrician". The address is the default saved
// address (Saved addresses). The estimate below is the sample shown in
// design/source/Post.dc.html; it is replaced by real data from Supabase in
// Sprint 2.
export default function DescribeJobRoute() {
  const router = useRouter();
  const address = useBookingAddress();
  const { service } = useLocalSearchParams<{ service?: string }>();

  // A deep link can carry any text. Anything that is not a service this
  // screen is ready for goes back to Home rather than rendering half a screen.
  if (!isJobServiceKey(service)) {
    return <Redirect href="/home" />;
  }

  return (
    <DescribeJobScreen
      service={service}
      address={address}
      estimateRange="₹400 – 700"
      // Opened by a deep link there is nothing to go back to, so go to Home.
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/home'))}
      // The draft is not sent anywhere yet (Sprint 2); this only opens the next screen.
      onSubmit={() => router.push({ pathname: '/job/searching', params: { service } })}
      // These screens don't hand their result back to this job yet; that needs
      // a shared job draft (Sprint 2).
      onAddPhoto={() => router.push('/job/new/media')}
      onVoiceNote={() => router.push('/job/new/media')}
      onChooseTime={() => router.push('/job/new/schedule')}
      onChangeAddress={() => router.push('/addresses')}
    />
  );
}
