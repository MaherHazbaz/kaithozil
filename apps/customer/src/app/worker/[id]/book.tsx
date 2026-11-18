import { useLocalSearchParams, useRouter } from 'expo-router';

import { BookWorkerScreen } from '@/features/worker/screens/BookWorkerScreen';

// Route "/worker/:id/book". Expo Router allows this folder next to
// worker/[id].tsx: "/worker/:id" opens the public profile, "/worker/:id/book"
// this screen.
//
// SAMPLE DATA: whatever the id, this shows the one worker drawn in
// design/source/Book.dc.html. In Sprint 2 the id is looked up on the server,
// and an unknown id shows a "not found" state.
//
// NOT WIRED YET: Book only opens Booking request sent (as the design's link
// does); sending the request to the worker needs the Sprint 2 server function.
export default function BookWorkerRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <BookWorkerScreen
      worker={{
        id: 'murugan-k',
        name: 'Murugan K.',
        firstName: 'Murugan',
        initials: 'MK',
        trade: 'Electrician',
        badge: 'Verified · Level 2',
        rating: '4.8',
        jobsDone: 280,
        experienceYears: 12,
        tags: ['Wiring', 'Fans & lights', 'Inverter', 'Tamil, English'],
      }}
      slots={[
        { id: 'today', day: 'Today', time: '4 – 6 PM' },
        { id: 'tomorrow', day: 'Tomorrow', time: '9 – 11 AM' },
      ]}
      problem="Fan not working"
      estimateRange="₹400 – 700"
      // Opened by a deep link there is nothing to go back to, so go to Home.
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/home'))}
      // The server will return the new request's id; the worker id stands in.
      onBook={() => router.push({ pathname: '/booking/[id]', params: { id } })}
    />
  );
}
