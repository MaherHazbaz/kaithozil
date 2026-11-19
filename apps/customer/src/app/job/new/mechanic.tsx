import { useRouter } from 'expo-router';

import { mechanicSummary } from '@/features/job/mechanicDraft';
import { MechanicScreen } from '@/features/job/screens/MechanicScreen';

// Route "/job/new/mechanic". The address is the sample shown in
// design/source/MechPost.dc.html; it comes from Supabase in Sprint 2.
//
// NOT WIRED YET:
// - The job is not sent anywhere until Sprint 2; "Find a mechanic" only opens
//   Finding a worker, as the design does.
// - Broken down promises to share live location, which needs expo-location.
export default function MechanicRoute() {
  const router = useRouter();
  return (
    <MechanicScreen
      address={{ label: 'Home', line: '12, 4th Street, Anna Nagar' }}
      // Opened by a deep link there is nothing to go back to, so go to Home.
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/home'))}
      onAddPhoto={() => router.push('/job/new/media')}
      onVoiceNote={() => router.push('/job/new/media')}
      onChooseTime={() => router.push('/job/new/schedule')}
      onChangeAddress={() => router.push('/addresses')}
      onSubmit={(job) =>
        router.push({
          pathname: '/job/searching',
          params: { service: 'mechanic', summary: mechanicSummary(job) },
        })
      }
    />
  );
}
