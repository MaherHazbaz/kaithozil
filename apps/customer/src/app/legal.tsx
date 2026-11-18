import { useLocalSearchParams, useRouter } from 'expo-router';

import { LegalScreen } from '@/features/settings/screens/LegalScreen';

// Route "/legal" ("?tab=privacy" or "?tab=data" opens another tab).
//
// NOT WIRED YET: "Download my data" needs the backend, "Manage my consents"
// opens a worker screen, and the full terms have no web address yet.
export default function LegalRoute() {
  const router = useRouter();
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  return (
    <LegalScreen
      initialTab={tab === 'privacy' || tab === 'data' ? tab : 'terms'}
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/profile'))}
      onDataAction={(action) => {
        if (action === 'correct') router.push('/profile');
        if (action === 'delete') router.push('/account/delete');
      }}
    />
  );
}
