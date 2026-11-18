import { useLocalSearchParams, useRouter } from 'expo-router';

import { billTotal } from '@/features/bill/billMoney';
import { sampleBill, sampleVerifiedPayment } from '@/features/bill/sampleData';
import { PayScreen } from '@/features/bill/screens/PayScreen';
import type { PaymentResult } from '@/features/bill/types';

// Route "/job/:id/pay": Pay and rate, reached from Check the bill (and from a
// tailor order's "Fits well, pay").
//
// SAMPLE DATA: whatever the id, this shows the job drawn in
// design/source/Pay.dc.html. For review, `?result=failed` shows the "didn't
// go through" state instead of "verified" (the design's "result" tweak).
//
// NOT WIRED YET:
// - PAYMENTS ARE NOT BUILT. They wait on the owner's decision: design v3 pays
//   through a payment gateway ([PAYMENT PARTNER]) with cash allowed, while
//   CLAUDE.md "Trust rules" says direct UPI with no gateway. No payment SDK,
//   gateway or `upi://` link is called. Every UPI app button and "I've paid,
//   check now" only waits as long as the design's prototype (2.2 s) and then
//   shows the sample result; no money moves and nothing is recorded.
// - "I paid in cash" records nothing.
// - The rating and chips are not saved; "Done" only goes to Bookings.
export default function PayRoute() {
  const router = useRouter();
  const { id, result } = useLocalSearchParams<{ id: string; result?: string }>();
  const jobId = id ?? sampleBill.jobId;
  const sampleResult: PaymentResult =
    result === 'failed' ? { status: 'failed' } : sampleVerifiedPayment;
  return (
    <PayScreen
      worker={sampleBill.worker}
      workDone={sampleBill.workDone}
      jobId={sampleBill.jobId}
      amountRupees={billTotal(sampleBill.lines)}
      onStartPayment={() =>
        new Promise((resolve) => setTimeout(() => resolve(sampleResult), SAMPLE_BANK_DELAY_MS))
      }
      onConfirmCash={async () => {}}
      onViewReceipt={() => router.push({ pathname: '/job/[id]/receipt', params: { id: jobId } })}
      onDone={async () => {
        // Close the job screens back down to Home, then swap Home for the
        // Bookings tab, so Back from Bookings does not return to a paid job.
        router.dismissTo('/home');
        router.replace('/bookings');
      }}
    />
  );
}

/** How long Pay.dc.html's prototype "waits for the bank" before answering. */
const SAMPLE_BANK_DELAY_MS = 2200;
