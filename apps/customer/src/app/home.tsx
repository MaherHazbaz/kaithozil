import { useRouter } from 'expo-router';

import { HomeScreen } from '@/features/home/screens/HomeScreen';
import { isJobServiceKey } from '@/features/job/copy';

// Route "/home". The values below are the sample data shown in
// design/source/Main.dc.html; they are replaced by real data from Supabase in
// Sprint 2. Navigation targets (Crew, Book, Bookings, Profile) are wired as
// those screens are built.
export default function HomeRoute() {
  const router = useRouter();
  return (
    <HomeScreen
      customerName="Priya"
      customerInitials="PR"
      areaName="Anna Nagar"
      verifiedWorkerCount={12}
      bookAgain={{ initials: 'MK', name: 'Murugan K.', trade: 'Electrician', rating: '4.8' }}
      onProfile={() => router.replace('/profile')}
      // Sample worker until bookings come from the server (Sprint 2).
      onBookAgain={() =>
        router.push({ pathname: '/worker/[id]/book', params: { id: 'murugan-k' } })
      }
      onTab={(tab) => {
        // `replace` swaps one tab screen for another, so Back does not walk
        // through every tab you visited.
        if (tab === 'bookings') router.replace('/bookings');
        if (tab === 'profile') router.replace('/profile');
      }}
      onSearch={() => router.push('/search')}
      onCrew={() => router.push('/crew/new')}
      onService={(service) => {
        // Mechanic has its own form (vehicle, roadside). Only services whose
        // Describe-the-job wording is approved open it; the other tiles do
        // nothing yet.
        if (service === 'mechanic') {
          router.push('/job/new/mechanic');
          return;
        }
        if (service === 'tailor') {
          router.push('/job/new/tailor');
          return;
        }
        if (service === 'housekeeping') {
          router.push('/job/new/housekeeping');
          return;
        }
        // Painters book a site visit first, then get a quote. Carpenters use
        // Describe the job for small repairs (docs/decisions/0008-more-trades.md).
        if (service === 'painter') {
          router.push('/job/new/visit');
          return;
        }
        if (isJobServiceKey(service)) {
          router.push({ pathname: '/job/new', params: { service } });
        }
      }}
    />
  );
}
