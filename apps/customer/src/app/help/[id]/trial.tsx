import { useLocalSearchParams, useRouter } from 'expo-router';

import { DEFAULT_DRAFT, housekeepingSummary } from '@/features/housekeeping/housekeepingDraft';
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
// - "Find another housekeeper" opens Finding a housekeeper but sends nothing.
//   SAMPLE DATA: its job line uses the design's default housekeeping request,
//   which matches this sample trial (Mon – Sat, 6 – 8 AM); in Sprint 2 it is
//   the arrangement's own request.
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
      onFindAnother={() =>
        router.push({
          pathname: '/job/searching',
          params: { service: 'housekeeping', summary: housekeepingSummary(DEFAULT_DRAFT) },
        })
      }
    />
  );
}
