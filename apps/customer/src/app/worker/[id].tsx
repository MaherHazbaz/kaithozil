import { useRouter } from 'expo-router';

import { WorkerProfileScreen } from '@/features/worker/screens/WorkerProfileScreen';

// Route "/worker/:id". A file named [id].tsx matches any value in that place
// (like a dynamic segment in Next.js).
//
// SAMPLE DATA: whatever the id, this shows the one worker drawn in
// design/source/Book.dc.html. In Sprint 2 the id is looked up on the server,
// and an unknown id shows a "not found" state. Booking is not built either:
// the button only opens Worker on the way, as the design's link does.
export default function WorkerProfileRoute() {
  const router = useRouter();
  return (
    <WorkerProfileScreen
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
      onBook={() => router.push('/job/tracking')}
    />
  );
}
