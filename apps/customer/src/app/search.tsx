import { useRouter } from 'expo-router';

import { SAMPLE_WORKERS } from '@/features/search/sampleWorkers';
import { SearchScreen } from '@/features/search/screens/SearchScreen';

// Route "/search". The query, filters and three workers are the sample data
// shown in design/source/Search.dc.html; "12" is the design's total for the
// area. Results come from a Supabase search (by trade, distance, rating, level
// and availability) in Sprint 2.
//
// NOT WIRED YET: the query and filters only narrow this sample list on the
// phone; "Near me" needs the customer's location (expo-location). Each card
// opens the existing worker screen, which still shows one sample worker.
export default function SearchRoute() {
  const router = useRouter();
  return (
    <SearchScreen
      workers={SAMPLE_WORKERS}
      totalCount={12}
      areaName="Anna Nagar"
      initialQuery="switchboard repair"
      initialFilters={['nearMe']}
      // Opened by a deep link there is nothing to go back to, so go to Home.
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/home'))}
      onOpenWorker={(id) => router.push({ pathname: '/worker/[id]', params: { id } })}
      // Only the electrician form exists, and every sample result is an electrician.
      onPostJob={() => router.push({ pathname: '/job/new', params: { service: 'electrician' } })}
    />
  );
}
