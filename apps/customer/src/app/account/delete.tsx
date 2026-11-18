import { useRouter } from 'expo-router';

import { DeleteAccountScreen } from '@/features/settings/screens/DeleteAccountScreen';

// Route "/account/delete": Log out or delete account.
//
// SAMPLE BEHAVIOUR until Supabase (Sprint 2): no code is sent, any 6 digits
// are accepted, and nothing is deleted. The real deletion is a server
// function that checks for active bookings and open disputes first.
export default function DeleteAccountRoute() {
  const router = useRouter();
  const toWelcome = () => router.dismissTo('/welcome');
  return (
    <DeleteAccountScreen
      maskedPhone="+91 98400 ••345"
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/profile'))}
      onLogOut={toWelcome}
      onConfirm={async () => {}}
      onClose={toWelcome}
    />
  );
}
