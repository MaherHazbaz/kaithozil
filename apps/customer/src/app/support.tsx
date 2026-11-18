import { useRouter } from 'expo-router';

import { SAMPLE_LAST_JOB, SAMPLE_TICKET } from '@/features/support/sampleData';
import { SupportScreen } from '@/features/support/screens/SupportScreen';

// Route "/support": Help and support, with the design's sample last job.
//
// NOT WIRED YET: choosing an issue should create a ticket for it on the server
// and open that ticket; until then every issue opens the sample ticket.
// "Call us" and "WhatsApp us" have no numbers yet (support hours are still
// [SUPPORT HOURS]).
export default function SupportRoute() {
  const router = useRouter();
  return (
    <SupportScreen
      lastJob={SAMPLE_LAST_JOB}
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/profile'))}
      onIssue={() =>
        router.push({ pathname: '/support/[id]', params: { id: SAMPLE_TICKET.reference } })
      }
    />
  );
}
