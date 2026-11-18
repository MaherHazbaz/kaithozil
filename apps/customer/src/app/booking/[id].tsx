import { useLocalSearchParams, useRouter } from 'expo-router';

import {
  SAMPLE_REQUEST,
  SAMPLE_SIMILAR_WORKERS,
  SAMPLE_SUGGESTION,
} from '@/features/booking/sampleRequest';
import { RequestSentScreen } from '@/features/booking/screens/RequestSentScreen';
import { isBookingOutcome } from '@/features/booking/types';

// Route "/booking/:id?state=waiting|accepted|newTime|declined". The `state`
// query parameter picks the outcome for design review; without it (or with an
// unknown value) the screen shows "waiting".
//
// SAMPLE DATA: whatever the id, this shows the request drawn in
// design/source/RequestSent.dc.html. In Sprint 2 the request and the worker's
// reply come from Supabase (with a realtime update when the worker answers),
// and `state` goes away.
//
// NOT WIRED YET: cancelling, accepting the new time and the reply deadline
// need server functions.
export default function BookingRoute() {
  const router = useRouter();
  const { state } = useLocalSearchParams<{ id: string; state?: string }>();
  const outcome = isBookingOutcome(state) ? state : 'waiting';
  const back = () => (router.canGoBack() ? router.back() : router.replace('/home'));
  return (
    <RequestSentScreen
      // A new `state` starts the screen afresh (a changed key remounts it).
      key={outcome}
      request={SAMPLE_REQUEST}
      outcome={outcome}
      suggestion={SAMPLE_SUGGESTION}
      similarWorkers={SAMPLE_SIMILAR_WORKERS}
      onBack={back}
      // The design's link goes back to the worker's profile.
      onCancelRequest={back}
      onGoToBookings={() => router.push('/bookings')}
      onPickAnotherTime={() => router.push('/job/new/schedule')}
      onChooseAnotherWorker={() => router.push('/search')}
      onFindWorker={() =>
        router.push({ pathname: '/job/searching', params: { service: 'electrician' } })
      }
      onOpenWorker={(id) => router.push({ pathname: '/worker/[id]', params: { id } })}
      onSeeAll={() => router.push('/search')}
      onMessage={() => router.push({ pathname: '/job/[id]/chat', params: { id: 'KT-20517' } })}
    />
  );
}
