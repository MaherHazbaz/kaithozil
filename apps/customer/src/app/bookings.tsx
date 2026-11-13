import { useRouter } from 'expo-router';

import { BookingsScreen } from '@/features/bookings/screens/BookingsScreen';

// Route "/bookings". The lists below are the sample data shown in
// design/source/Bookings.dc.html; they are replaced by real data from Supabase
// in Sprint 2. Opening a booking, Book again and Get help are wired as the
// screens they lead to (Crew confirmed, Finding a worker, Worker profile,
// Support) are built.
export default function BookingsRoute() {
  const router = useRouter();
  return (
    <BookingsScreen
      upcoming={[
        {
          id: 'crew-1',
          icon: 'brickWall',
          title: 'Construction crew · 7 workers',
          detail: 'From tomorrow, 8 AM · 5 days · New house',
          status: { label: 'Team confirmed', tone: 'purple' },
        },
        {
          id: 'job-2',
          icon: 'paintRoller',
          title: 'Painter · 2 bedroom walls',
          detail: 'Sat 15 Nov, 9 AM',
          status: { label: 'Finding a worker', tone: 'mango' },
        },
      ]}
      past={[
        {
          id: 'KT-20481',
          icon: 'zap',
          title: 'Fan repair · Murugan K.',
          detail: '10 Nov · KT-20481',
          amountRupees: 650,
        },
        {
          id: 'KT-19977',
          icon: 'droplet',
          title: 'Tap leak · Ravi S.',
          detail: '2 Nov · KT-19977',
          amountRupees: 350,
        },
      ]}
      onTab={(tab) => {
        // `replace` swaps one tab screen for another, so Back does not walk
        // through every tab you visited.
        if (tab === 'home') router.replace('/home');
        if (tab === 'profile') router.replace('/profile');
      }}
    />
  );
}
