import { useRouter } from 'expo-router';

import { VisitRequestScreen } from '@/features/quote/screens/VisitRequestScreen';

// Route "/job/new/visit": painters book a site visit before they get a quote.
// The address and visit time are the samples shown in
// design/source/QuoteRequest.dc.html; they come from Addresses and Schedule
// once a shared job draft exists (Sprint 2).
//
// NOT WIRED YET:
// - Only the painter's wording is designed. Carpenters use Describe the job for
//   small repairs; custom furniture joins this screen once its wording is
//   approved (docs/decisions/0008-more-trades.md).
// - The visit fee is still [VISIT FEE]; nothing is charged here.
// - "Request a site visit" sends nothing: the sample answer below stands in
//   for the server choosing a nearby verified painter (Sprint 2).
export default function VisitRequestRoute() {
  const router = useRouter();
  return (
    <VisitRequestScreen
      address={{ label: 'Home', line: '12, 4th Street, Anna Nagar' }}
      visitSlot={{ day: 'Sat 15 Nov', time: '10 AM – 12 PM' }}
      // Opened by a deep link there is nothing to go back to, so go to Home.
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/home'))}
      onAddPhotos={() => router.push('/job/new/media')}
      onVoiceNote={() => router.push('/job/new/media')}
      onChangeTime={() => router.push('/job/new/schedule')}
      onChangeAddress={() => router.push('/addresses')}
      onRequest={async () => ({ workerName: 'Ravi S.', workerLevel: 'Level 2' })}
      onSeeQuote={() => router.push({ pathname: '/quote/[id]', params: { id: 'Q-1001' } })}
      // Bookings is a tab: replace, so Back does not return to this form.
      onBookings={() => router.replace('/bookings')}
    />
  );
}
