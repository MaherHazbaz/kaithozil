import { HomeScreen } from '@/features/home/screens/HomeScreen';

// Route "/home". The values below are the sample data shown in
// design/source/Main.dc.html; they are replaced by real data from Supabase in
// Sprint 2. Navigation targets (Post, Crew, Book, Bookings, Profile) are wired
// as those screens are built.
export default function HomeRoute() {
  return (
    <HomeScreen
      customerName="Priya"
      customerInitials="PR"
      areaName="Anna Nagar"
      verifiedWorkerCount={12}
      bookAgain={{ initials: 'MK', name: 'Murugan K.', trade: 'Electrician', rating: '4.8' }}
    />
  );
}
