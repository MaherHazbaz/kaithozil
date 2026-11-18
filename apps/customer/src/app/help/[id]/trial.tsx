import { useLocalSearchParams, useRouter } from 'expo-router';

import { sampleTrial } from '@/features/housekeeping/sampleData';
import { TrialDecisionScreen } from '@/features/housekeeping/screens/TrialDecisionScreen';

// Route "/help/:id/trial".
//
// SAMPLE DATA: whatever the id, this shows the trial drawn in
// design/source/TrialDecision.dc.html. In Sprint 2 it is loaded from Supabase
// by id, with loading, not-found and error states.
//
// NOT WIRED YET:
// - "Continue with Lakshmi" and "Try someone else" resolve at once without
//   telling anyone. They become server functions (Sprint 2) that record the
//   rating and the decision once (idempotent).
// - "Find another housekeeper" does nothing: Finding a worker has approved
//   wording for electricians only (see /job/new/housekeeping).
// - PAYMENTS ARE NOT BUILT: paying for the trial day ([VISIT RATE]) and the
//   monthly pay ([MONTHLY RATE]) wait on the owner's decision (gateway or
//   direct UPI, CLAUDE.md "Trust rules").
export default function TrialDecisionRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const helpId = id ?? sampleTrial.helpId;
  return (
    <TrialDecisionScreen
      trial={sampleTrial}
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/bookings'))}
      onContinue={async () => {}}
      onTrySomeoneElse={async () => {}}
      // `replace`: Back from Regular help should not return to a decided trial.
      onSeeRegularHelp={() => router.replace({ pathname: '/help/[id]', params: { id: helpId } })}
    />
  );
}
