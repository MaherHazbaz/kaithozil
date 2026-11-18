import { useLocalSearchParams, useRouter } from 'expo-router';

import { sampleConfirmedCrew } from '@/features/crew/sampleData';
import { CrewTeamScreen } from '@/features/crew/screens/CrewTeamScreen';

// Route "/crew/:id": Crew confirmed (Your crew), reached from Bookings, from
// Book construction crew and from a confirmed job plan. "/crew/:id/payments"
// lives in the crew/[id]/ folder next to this file.
//
// SAMPLE DATA: whatever the id, this shows the crew drawn in
// design/source/CrewTeam.dc.html. In Sprint 2 the booking is loaded from
// Supabase by id (with loading, not-found and error states).
//
// NOT WIRED YET: "Call Selvam" does nothing. Phone numbers stay private
// (DESIGN.md "No contact details"), so calling needs a masked-number service,
// which is not chosen yet.
export default function CrewTeamRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const crewId = id ?? sampleConfirmedCrew.id;
  return (
    <CrewTeamScreen
      crew={sampleConfirmedCrew}
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/bookings'))}
      onPayments={() => router.push({ pathname: '/crew/[id]/payments', params: { id: crewId } })}
      onChangeSize={() => router.push('/crew/new')}
    />
  );
}
