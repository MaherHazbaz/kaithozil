import { useRouter } from 'expo-router';

import { sampleCrewProfile } from '@/features/crew/sampleData';
import { CrewProfileScreen } from '@/features/crew/screens/CrewProfileScreen';

// Route "/crews/:id": a construction crew's public profile, reached from
// "Prefer to choose your crew?" on Book construction crew.
//
// SAMPLE DATA: whatever the id, this shows the crew drawn in
// design/source/CrewProfile.dc.html. In Sprint 2 the crew is loaded from
// Supabase by id (with loading, not-found and error states), and real site
// photos replace the stand-in drawings.
//
// NOT WIRED YET: "Book this crew" goes back to Book construction crew, as in
// the design; choosing this particular crew for the request needs the server.
export default function CrewProfileRoute() {
  const router = useRouter();
  const back = () => (router.canGoBack() ? router.back() : router.replace('/crew/new'));
  return <CrewProfileScreen crew={sampleCrewProfile} onBack={back} onBook={back} />;
}
