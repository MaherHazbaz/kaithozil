import { useRouter } from 'expo-router';

import { PaymentsScreen } from '@/features/payments/screens/PaymentsScreen';

// Route "/payments". The preferred app ("Ask me every time") and the two
// payments are the sample data in design/source/Payments.dc.html.
//
// NOT WIRED YET: the preference is not saved, and the payment history comes
// from the payments ledger in Supabase (Sprint 2). Nothing here opens a UPI
// app or records a payment.
export default function PaymentsRoute() {
  const router = useRouter();
  return (
    <PaymentsScreen
      initialApp="ask"
      payments={[
        {
          id: 'p1',
          title: 'Fan repair · Murugan K.',
          detail: '10 Nov · UPI ref ••4821',
          amount: '₹650',
        },
        { id: 'p2', title: 'Tap leak · Ravi S.', detail: '2 Nov · UPI ref ••1907', amount: '₹350' },
      ]}
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/profile'))}
    />
  );
}
