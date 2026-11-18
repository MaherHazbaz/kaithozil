import { useRouter } from 'expo-router';

import { defaultCrewRequest, sampleConfirmedCrew, sampleJobPlan } from '@/features/crew/sampleData';
import { CrewBookScreen } from '@/features/crew/screens/CrewBookScreen';

// Route "/crew/new": Book construction crew, reached from Home's construction
// crew card and from "Change team size" on Your crew. A file named new.tsx
// wins over the [id].tsx next to it, so "/crew/new" never opens a crew called
// "new".
//
// SAMPLE DATA: the starting choices are the ones drawn in
// design/source/Crew.dc.html (2 + 3 + 2 workers, 5 days, with a mestri).
//
// NOT WIRED YET:
// - "Find 7 workers" resolves at once and sends nobody. In Sprint 2 it becomes
//   a server function that records the request and offers it to verified
//   mestri teams nearby. Like the design's prototype, it then opens the sample
//   crew (Your crew), or the sample job plan when "Not sure" is on.
// - "Prefer to choose your crew?" opens the one sample crew; the list of
//   crews to choose from is not designed yet.
export default function CrewBookRoute() {
  const router = useRouter();
  return (
    <CrewBookScreen
      initialRequest={defaultCrewRequest}
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/home'))}
      onChooseCrew={() => router.push({ pathname: '/crews/[id]', params: { id: 'selvam-crew' } })}
      onFind={async (request) => {
        if (request.unsure) {
          router.push({ pathname: '/job/[id]/plan', params: { id: sampleJobPlan.id } });
        } else {
          router.push({ pathname: '/crew/[id]', params: { id: sampleConfirmedCrew.id } });
        }
      }}
    />
  );
}
