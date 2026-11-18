import { useRouter } from 'expo-router';

import { SAMPLE_PEOPLE } from '@/features/measurements/sampleData';
import { MyMeasurementsScreen } from '@/features/measurements/screens/MyMeasurementsScreen';

// Route "/measurements": the design's sample people and garments until
// measurements come from Supabase.
//
// NOT WIRED YET: Edit and "Add a person" need the measurement form and the backend.
export default function MeasurementsRoute() {
  const router = useRouter();
  return (
    <MyMeasurementsScreen
      people={SAMPLE_PEOPLE}
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/profile'))}
      onBook={() => router.push('/job/new/tailor')}
    />
  );
}
