import { useRouter } from 'expo-router';

import { ProfileScreen } from '@/features/profile/screens/ProfileScreen';

// Route "/profile". The values below are the sample data shown in
// design/source/Profile.dc.html; they are replaced by real data from Supabase
// in Sprint 2. Edit and the rows are wired as the screens they lead to are
// built (Help and support leads to Support).
export default function ProfileRoute() {
  const router = useRouter();
  return (
    <ProfileScreen
      name="Priya R."
      initials="PR"
      phone="+91 98400 12345"
      addressesSummary="Home · Anna Nagar, and 1 more"
      measurementsSummary="For tailoring · you and Amma"
      onRow={(row) => {
        // Business account has no screen in the design yet, so it does nothing.
        if (row === 'addresses') router.push('/addresses');
        if (row === 'measurements') router.push('/measurements');
        if (row === 'payments') router.push('/payments');
        if (row === 'help') router.push('/support');
        if (row === 'language') router.push('/language');
        if (row === 'safety') router.push('/safety');
        if (row === 'terms') router.push('/legal');
        if (row === 'logOut') router.push('/account/delete');
      }}
      onTab={(tab) => {
        // `replace` swaps one tab screen for another, so Back does not walk
        // through every tab you visited.
        if (tab === 'home') router.replace('/home');
        if (tab === 'bookings') router.replace('/bookings');
      }}
    />
  );
}
