import { AppText, Card, PrimaryButton, SecondaryButton, TickItem, color } from '@kaithozhil/ui';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { PageLayout } from '@/components/PageLayout';
import { DetailRow } from '@/features/quote/components/Parts';
import { useAsyncAction } from '@/features/quote/hooks/useAsyncAction';

import { ConfirmedNote, HousekeeperCard, MessageCard, RowsCard } from '../components/Parts';
import { StarRating } from '../components/Pickers';
import { trialCopy as copy } from '../copy';
import type { TrialSummary } from '../types';

/** Waiting for the customer's choice, then the outcome they chose. */
export type TrialDecision = 'decide' | 'continue' | 'other';

export type TrialDecisionScreenProps = {
  trial: TrialSummary;
  /** Default "decide". Tests and the dev states can show the outcomes. */
  initialDecision?: TrialDecision;
  /** Default 5, as drawn. */
  initialRating?: number;
  onBack: () => void;
  /**
   * "Continue with …": confirms regular help on the server with the rating.
   * Resolves when recorded; rejects to stay on the choice.
   */
  onContinue: (rating: number) => Promise<void>;
  /** "Try someone else": ends the trial with the rating (kept private). */
  onTrySomeoneElse: (rating: number) => Promise<void>;
  onSeeRegularHelp?: () => void;
  onFindAnother?: () => void;
};

/** Customer · After the trial day (design/source/TrialDecision.dc.html). */
export function TrialDecisionScreen({
  trial,
  initialDecision = 'decide',
  initialRating = 5,
  onBack,
  onContinue,
  onTrySomeoneElse,
  onSeeRegularHelp,
  onFindAnother,
}: TrialDecisionScreenProps) {
  const [decision, setDecision] = useState<TrialDecision>(initialDecision);
  const [rating, setRating] = useState(initialRating);
  const { busy, run } = useAsyncAction();
  const { housekeeper } = trial;

  const decide = (action: (rating: number) => Promise<void>, next: TrialDecision) => {
    void run(async () => {
      await action(rating);
      setDecision(next);
    });
  };

  return (
    <PageLayout
      title={copy.title}
      titleTamil={copy.titleTamil}
      backLabel={copy.back}
      onBack={onBack}
    >
      <HousekeeperCard
        housekeeper={housekeeper}
        subtitle={trial.when}
        verifiedLabel={copy.verified}
        testID="trial-housekeeper"
      />

      <Card style={styles.rating}>
        <View style={styles.ratingHeader}>
          <AppText size={15} weight={800} accessibilityRole="header">
            {copy.ratingTitle}
          </AppText>
          <AppText size={13} weight={700} color={color.star} testID="trial-rating-word">
            {copy.ratingWords[rating] ?? ''}
          </AppText>
        </View>
        <StarRating
          value={rating}
          // The rating is sent with the decision, so it is fixed once made.
          onChange={decision === 'decide' ? setRating : () => {}}
          starLabel={copy.starLabel}
          accessibilityLabel={copy.ratingGroup}
        />
        {trial.tasks.map((task) => (
          <TickItem key={task}>{task}</TickItem>
        ))}
      </Card>

      {decision === 'decide' ? (
        <>
          <RowsCard heading={copy.ifContinue}>
            {trial.ifContinue.map((row) => (
              <DetailRow
                key={row.label}
                variant="summary"
                label={row.label}
                labelDetail={row.labelDetail}
                value={row.value}
              />
            ))}
          </RowsCard>
          <PrimaryButton
            label={copy.continueWith(housekeeper.firstName)}
            disabled={busy}
            onPress={() => decide(onContinue, 'continue')}
            testID="trial-continue"
          />
          <SecondaryButton
            label={copy.trySomeoneElse}
            tone="ink"
            disabled={busy}
            onPress={() => decide(onTrySomeoneElse, 'other')}
            testID="trial-other"
          />
          <AppText size={12} color={color.muted} align="center">
            {copy.paidEitherWay}
          </AppText>
        </>
      ) : null}

      {decision === 'continue' ? (
        <>
          <ConfirmedNote
            title={copy.confirmedTitle}
            detail={copy.confirmedDetail(housekeeper.firstName, trial.startsAt)}
            testID="trial-confirmed"
          />
          <PrimaryButton
            label={copy.seeRegularHelp}
            onPress={onSeeRegularHelp}
            testID="trial-see-plan"
          />
        </>
      ) : null}

      {decision === 'other' ? (
        <>
          <MessageCard
            title={copy.otherTitle}
            body={copy.otherBody(housekeeper.firstName)}
            testID="trial-other-card"
          />
          <PrimaryButton
            label={copy.findAnother}
            onPress={onFindAnother}
            testID="trial-find-another"
          />
        </>
      ) : null}
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  rating: { padding: 14, gap: 10 },
  ratingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
});
