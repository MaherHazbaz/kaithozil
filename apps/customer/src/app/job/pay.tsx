import { useRouter } from 'expo-router';

import { PayScreen } from '@/features/job/screens/PayScreen';

// Route "/job/pay". The job below is the sample data shown in
// design/source/Pay.dc.html; in Sprint 2 it comes from the finished job on the
// server.
//
// NOT BUILT YET: paying. The button only moves on to Bookings, as the design's
// link does. The real flow (CLAUDE.md trust rules) opens a `upi://pay` link to
// the worker, and the job counts as paid only when the customer's "Paid" and
// the worker's "Received" are both confirmed by a server function. The rating
// and feedback chips are not saved anywhere yet either.
export default function PayRoute() {
  const router = useRouter();
  return (
    <PayScreen
      worker={{ name: 'Murugan K.', firstName: 'Murugan' }}
      workDone="Fan repair + new regulator"
      jobId="KT-20481"
      amountRupees={650}
      onPay={() => {
        // Close the job screens back down to Home, then swap Home for the
        // Bookings tab, so Back from Bookings does not return to a paid job.
        router.dismissTo('/home');
        router.replace('/bookings');
      }}
    />
  );
}
