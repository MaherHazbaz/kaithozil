import { useLocalSearchParams, useRouter } from 'expo-router';

import { sampleQuote } from '@/features/quote/sampleData';
import { QuoteScreen } from '@/features/quote/screens/QuoteScreen';

// Route "/quote/:id".
//
// SAMPLE DATA: whatever the id, this shows the quote drawn in
// design/source/QuoteView.dc.html. In Sprint 2 the quote is loaded from
// Supabase by id (with loading, not-found and error states).
//
// NOT WIRED YET:
// - Accept, Decline and Undo resolve at once without telling anyone. They
//   become server functions in Sprint 2. Accepting takes no money.
// - PAYMENTS ARE NOT BUILT: the staged UPI payments the note promises wait on
//   the owner's decision (gateway or direct UPI, CLAUDE.md "Trust rules").
export default function QuoteRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const jobId = id ?? sampleQuote.id;
  return (
    <QuoteScreen
      quote={sampleQuote}
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/bookings'))}
      onOpenWorker={() =>
        router.push({ pathname: '/worker/[id]', params: { id: sampleQuote.worker.id } })
      }
      onAccept={async () => {}}
      onDecline={async () => {}}
      onReopen={async () => {}}
      onAsk={() => router.push({ pathname: '/job/[id]/chat', params: { id: jobId } })}
      onCompare={() => router.push('/search')}
      onSeeProgress={() => router.push({ pathname: '/job/[id]/progress', params: { id: jobId } })}
    />
  );
}
