import { useRouter } from 'expo-router';

import { SAMPLE_TICKET } from '@/features/support/sampleData';
import { TicketScreen } from '@/features/support/screens/TicketScreen';

// Route "/support/[id]": a support ticket. Shows the design's sample ticket
// whatever the id, until tickets come from Supabase.
//
// NOT WIRED YET: replies are shown but not sent anywhere, and attaching a
// screenshot needs a native picker (not installed). The safety link opens the
// Safety screen, whose call button waits for [SAFETY NUMBER] (the design
// links it back to Support, which looks like a stand-in).
export default function TicketRoute() {
  const router = useRouter();
  return (
    <TicketScreen
      ticket={SAMPLE_TICKET}
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/support'))}
      onCallSafetyLine={() => router.push('/safety')}
    />
  );
}
