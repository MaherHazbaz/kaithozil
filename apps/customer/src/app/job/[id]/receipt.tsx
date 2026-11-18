import { useLocalSearchParams, useRouter } from 'expo-router';

import { sampleReceipt } from '@/features/bill/sampleData';
import { ReceiptScreen } from '@/features/bill/screens/ReceiptScreen';

// Route "/job/:id/receipt".
//
// SAMPLE DATA: whatever the id, this shows the receipt drawn in
// design/source/Receipt.dc.html. For review, `?paidBy=cash` shows the "Cash,
// not verified" version (the design's "Paid by" tweak). In Sprint 2 the
// receipt comes from the server's payment ledger by job id, with loading,
// not-found and error states.
//
// NOT WIRED YET:
// - Payments wait on the owner's decision (CLAUDE.md "Trust rules"), so the
//   "verified" proof and UPI reference are sample text.
// - Download PDF and Share: the PDF is made on the server (Sprint 2).
export default function ReceiptRoute() {
  const router = useRouter();
  const { paidBy } = useLocalSearchParams<{ id: string; paidBy?: string }>();
  const receipt =
    paidBy === 'cash'
      ? { ...sampleReceipt, paidBy: 'cash' as const, upi: undefined }
      : sampleReceipt;
  return (
    <ReceiptScreen
      receipt={receipt}
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/bookings'))}
      onBookAgain={() =>
        router.push({ pathname: '/worker/[id]/book', params: { id: receipt.worker.id } })
      }
      onHelp={() => router.push('/support')}
    />
  );
}
