import { useRouter } from 'expo-router';

import { CancelBookingScreen } from '@/features/cancel/screens/CancelBookingScreen';

// Route "/job/[id]/cancel", e.g. "/job/KT-20517/cancel".
//
// SAMPLE DATA from design/source/CancelBooking.dc.html until Supabase (Sprint 2).
// NOT WIRED YET: the cancel itself. It will be a server function (keyed by
// the job id, idempotent, in a transaction with the job's state) that also
// applies the [CANCELLATION RULE]; for now it resolves straight away and
// nothing is cancelled.
export default function CancelBookingRoute() {
  const router = useRouter();
  const toTracking = () => (router.canGoBack() ? router.back() : router.replace('/job/tracking'));
  return (
    <CancelBookingScreen
      job={{
        service: 'Fan repair',
        worker: { name: 'Murugan K.', firstName: 'Murugan', initials: 'MK' },
        status: 'On the way · arrives in about 9 min',
      }}
      onBack={toTracking}
      onKeep={toTracking}
      onReschedule={() => router.push('/job/new/schedule')}
      onConfirm={async () => {}}
      // Closes the screens that led here and shows Bookings, as the design's link does.
      onCancelled={() => router.dismissTo('/bookings')}
    />
  );
}
