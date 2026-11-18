import { useRouter } from 'expo-router';

import { SafetyScreen } from '@/features/settings/screens/SafetyScreen';

// Route "/safety". The contact and settings are the sample data shown in
// design/source/Safety.dc.html; they come from Supabase in Sprint 2.
//
// NOT WIRED YET: the safety line number is still [SAFETY NUMBER], so the call
// button does nothing; editing and saving contacts need the backend.
export default function SafetyRoute() {
  const router = useRouter();
  return (
    <SafetyScreen
      contacts={[
        { id: 'c1', initials: 'RR', label: 'Ravi R. · husband', phoneMasked: '+91 98410 ••221' },
      ]}
      initialSettings={{ shareLocation: true, preferWomen: false }}
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/profile'))}
    />
  );
}
