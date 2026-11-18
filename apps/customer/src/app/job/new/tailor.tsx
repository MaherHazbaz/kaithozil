import { useRouter } from 'expo-router';

import { SAMPLE_ORDER, SAMPLE_SAVED_MEASUREMENTS } from '@/features/tailor/sampleData';
import { TailorBookScreen } from '@/features/tailor/screens/TailorBookScreen';

// Route "/job/new/tailor". The saved measurements line is the sample shown in
// design/source/TailorBook.dc.html; it comes from Supabase in Sprint 2.
//
// NOT WIRED YET:
// - The booking is not sent anywhere (Sprint 2). The button opens the sample
//   order, as the design's prototype does.
// - "Add a design you like" opens Photos and voice note, which cannot hand its
//   photos back to this booking until there is a shared job draft (Sprint 2).
// - [PICKUP FEE] is still to be decided.
export default function TailorBookRoute() {
  const router = useRouter();
  return (
    <TailorBookScreen
      savedMeasurements={SAMPLE_SAVED_MEASUREMENTS}
      // Opened by a deep link there is nothing to go back to, so go to Home.
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/home'))}
      onAddDesign={() => router.push('/job/new/media')}
      onSubmit={() => router.push({ pathname: '/order/[id]', params: { id: SAMPLE_ORDER.id } })}
    />
  );
}
