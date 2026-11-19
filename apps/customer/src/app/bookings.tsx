import { useRouter } from 'expo-router';

import { BookingsScreen } from '@/features/bookings/screens/BookingsScreen';

// Route "/bookings". The lists below are the sample data shown in
// design/source/Bookings.dc.html; they are replaced by real data from Supabase
// in Sprint 2. Opening a booking, View receipt and Get help are wired as the
// screens they lead to (After the trial day, Regular help, Crew confirmed,
// Finding a worker, Job receipt, Support) are built.
export default function BookingsRoute() {
  const router = useRouter();
  return (
    <BookingsScreen
      upcoming={[
        {
          id: 'help-trial-1',
          icon: 'calendar',
          iconTone: 'mango',
          title: 'Trial day done · Lakshmi R.',
          detail: 'Housekeeping · decide if you want to continue',
          status: { label: 'Decide', tone: 'mango' },
        },
        {
          id: 'help-1',
          icon: 'sparkles',
          title: 'Regular help · Lakshmi R.',
          detail: 'Housekeeping · Mon – Sat, 6 – 8 AM',
          status: { label: 'Active', tone: 'purple' },
        },
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
      onOpenBooking={(id) => {
        // Housekeeping cards (sample ids). The trial card opens the decision;
        // "help-trial-1" stands for arrangement "help-1" until Sprint 2.
        if (id === 'help-trial-1') {
          router.push({ pathname: '/help/[id]/trial', params: { id: 'help-1' } });
          return;
        }
        if (id === 'help-1') {
          router.push({ pathname: '/help/[id]', params: { id } });
          return;
        }
        // The construction crew card opens Your crew (CrewTeam.dc.html).
        if (id === 'crew-1') {
          router.push({ pathname: '/crew/[id]', params: { id } });
        }
      }}
      onBookWorker={() => router.replace('/home')}
      onTab={(tab) => {
        // `replace` swaps one tab screen for another, so Back does not walk
        // through every tab you visited.
        if (tab === 'home') router.replace('/home');
        if (tab === 'profile') router.replace('/profile');
      }}
    />
  );
}
