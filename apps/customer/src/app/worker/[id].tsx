import { useLocalSearchParams, useRouter } from 'expo-router';

import { SAMPLE_PROFILE } from '@/features/worker/sampleProfile';
import { PublicProfileScreen } from '@/features/worker/screens/PublicProfileScreen';

// Route "/worker/:id". A file named [id].tsx matches any value in that place
// (like a dynamic segment in Next.js). "/worker/:id/book" lives in the
// worker/[id]/ folder next to this file.
//
// SAMPLE DATA: whatever the id, this shows the one worker drawn in
// design/source/WorkerProfile.dc.html. In Sprint 2 the id is looked up on the
// server, with loading, "not found" and error states.
//
// NOT WIRED YET: Save only changes the button on the phone; saved workers need
// a Supabase table.
export default function WorkerProfileRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <PublicProfileScreen
      worker={SAMPLE_PROFILE}
      // Opened by a deep link there is nothing to go back to, so go to Home.
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/home'))}
      onBook={() => router.push({ pathname: '/worker/[id]/book', params: { id } })}
    />
  );
}
