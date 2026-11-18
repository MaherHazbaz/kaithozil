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
        // In design v3, Log out opens "Log out or delete account", which is
        // not built yet; until then it goes straight to Welcome. There is no
        // session to end yet; signing out of Supabase is added in Sprint 2.
        if (row === 'logOut') router.replace('/welcome');
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
