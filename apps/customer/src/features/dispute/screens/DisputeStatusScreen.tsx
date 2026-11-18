import { formatRupees } from '@kaithozhil/core';
import {
  AppText,
  Card,
  Gradient,
  Icon,
  InfoNote,
  PrimaryButton,
  SecondaryButton,
  color,
  radius,
  shadow,
} from '@kaithozhil/ui';
import { StyleSheet, View } from 'react-native';

import { BadgePageLayout } from '@/features/quote/components/BadgePageLayout';
import { useAsyncAction } from '@/features/quote/hooks/useAsyncAction';
import { AmountRow, JobLine, TextLink } from '../components/Parts';
import { disputeCopy as copy } from '../copy';
import { amountDueRupees } from '../disputeMoney';
import type { DisputeCase, DisputeDecision } from '../types';

export type DisputeStatusScreenProps = {
  dispute: DisputeCase;
  onBack: () => void;
  /** "Message the reviewer": the case's support ticket. */
  onMessageReviewer: () => void;
  /**
   * Pays what the decision says is due. PAYMENTS ARE NOT BUILT: the method
   * (gateway or direct UPI) waits on the owner's decision, so the route
   * resolves this without doing anything.
   */
  onPay: (amountRupees: number) => Promise<void>;
  /** "Disagree? Appeal within 7 days": the case's support ticket. */
  onAppeal: () => void;
};

/** Shared · Dispute status, customer side (design/source/DisputeStatus.dc.html). */
export function DisputeStatusScreen({
  dispute,
  onBack,
  onMessageReviewer,
  onPay,
  onAppeal,
}: DisputeStatusScreenProps) {
  const status = dispute.decision ? copy.status.decided : copy.status.review;
  return (
    <BadgePageLayout
      title={copy.title(dispute.caseId)}
      titleTamil={copy.titleTamil}
      backLabel={copy.back}
      onBack={onBack}
      badge={status}
      // The design draws both stages in mango.
      badgeTone="mango"
      badgeLabel={copy.statusLabel(status)}
      testID="dispute"
    >
      <JobLine job={dispute.job} />
      {dispute.decision ? (
        <Decided dispute={dispute} decision={dispute.decision} onPay={onPay} onAppeal={onAppeal} />
      ) : (
        <UnderReview dispute={dispute} onMessageReviewer={onMessageReviewer} />
      )}
    </BadgePageLayout>
  );
}

type StepState = 'done' | 'current' | 'upcoming';

function UnderReview({
  dispute,
  onMessageReviewer,
}: {
  dispute: DisputeCase;
  onMessageReviewer: () => void;
}) {
  const { evidence } = dispute;
  const steps: readonly { label: string; time: string; state: StepState }[] = [
    { label: copy.steps.reported(dispute.reportedBy), time: dispute.reportedAt, state: 'done' },
    { label: copy.steps.recorded, time: dispute.recordedAt, state: 'done' },
    { label: copy.steps.reviewing, time: copy.steps.reviewingTime, state: 'current' },
    { label: copy.steps.decision, time: copy.steps.decisionTime, state: 'upcoming' },
  ];
  return (
    <>
      <Card style={styles.timeline}>
        {steps.map((step) => (
          <View
            key={step.label}
            style={styles.step}
            // One stop for screen readers: "Work recorded by both, Sat 6:31 PM".
            accessible
            accessibilityLabel={`${step.label}, ${step.time}`}
          >
            <StepMarker state={step.state} />
            <View style={styles.stepText}>
              <AppText
                size={14}
                weight={step.state === 'current' ? 800 : 700}
                color={step.state === 'upcoming' ? color.muted : color.ink}
                style={styles.shrink}
              >
                {step.label}
              </AppText>
              <AppText size={12} color={color.muted}>
                {step.time}
              </AppText>
            </View>
          </View>
        ))}
      </Card>

      <Card style={styles.rows}>
        <AppText size={14} weight={800} accessibilityRole="header" style={styles.rowsTitle}>
          {copy.lookingAt}
        </AppText>
        <AmountRow
          label={copy.milestonesAgreed}
          value={copy.countOf(evidence.milestonesAgreed, evidence.milestonesTotal)}
        />
        {evidence.photos.map((photos) => (
          <AmountRow
            key={photos.from}
            label={copy.photosFrom(photos.from)}
            value={String(photos.count)}
          />
        ))}
        <AmountRow label={copy.chatMessages} value={String(evidence.chatMessages)} />
      </Card>

      <InfoNote tone="info" icon="lock">
        <AppText weight={700}>
          {copy.holdBold(formatRupees(dispute.amountInQuestionRupees))}
        </AppText>
        {copy.holdRest}
      </InfoNote>

      <SecondaryButton
        label={copy.messageReviewer}
        icon="messageSquare"
        onPress={onMessageReviewer}
        testID="dispute-message"
      />
    </>
  );
}

function Decided({
  dispute,
  decision,
  onPay,
  onAppeal,
}: {
  dispute: DisputeCase;
  decision: DisputeDecision;
  onPay: (amountRupees: number) => Promise<void>;
  onAppeal: () => void;
}) {
  const { busy, run } = useAsyncAction();
  const worker = dispute.job.workerFirstName;
  const due = amountDueRupees(decision.valueRupees, decision.paidRupees);
  const dueText = formatRupees(due);
  const valueText = formatRupees(decision.valueRupees);
  return (
    <>
      {/* Shadow on the outer view; the gradient clips to its corners and could not show it. */}
      <View style={styles.decisionShadow}>
        <Gradient name="hero" style={styles.decision}>
          <AppText size={12} color={color.lavenderText}>
            {copy.decisionDate(decision.date)}
          </AppText>
          <AppText
            size={18}
            weight={800}
            color={color.white}
            lineHeight={18 * 1.3}
            accessibilityRole="header"
          >
            {copy.decisionTitle(worker, dueText, decision.donePercent)}
          </AppText>
          <AppText size={13} color={color.lavenderText} lineHeight={13 * 1.45}>
            {decision.summary}
          </AppText>
        </Gradient>
      </View>

      <Card style={styles.rows}>
        <AmountRow label={copy.valueRow} value={valueText} />
        <AmountRow label={copy.paidRow} value={copy.minus(formatRupees(decision.paidRupees))} />
        <AmountRow label={copy.paysNow(dispute.job.customerFirstName)} value={dueText} strong />
        <AmountRow label={copy.earningsRow(worker)} value={valueText} />
        <AmountRow label={copy.feeRow} value={copy.feeValue} />
      </Card>

      <PrimaryButton
        label={copy.pay(dueText)}
        disabled={busy}
        onPress={() => {
          void run(() => onPay(due));
        }}
        testID="dispute-pay"
      />
      <TextLink label={copy.appeal} onPress={onAppeal} testID="dispute-appeal" />
    </>
  );
}

function StepMarker({ state }: { state: StepState }) {
  if (state === 'done') {
    return (
      <View style={[styles.marker, styles.markerDone]}>
        <Icon name="check" size={16} color={color.white} strokeWidth={3} />
      </View>
    );
  }
  if (state === 'current') {
    return (
      <View style={[styles.marker, styles.markerCurrent]}>
        <View style={styles.markerDot} />
      </View>
    );
  }
  return <View style={[styles.marker, styles.markerUpcoming]} />;
}

const MARKER = 28;
const MARKER_DOT = 10;

const styles = StyleSheet.create({
  shrink: { flexShrink: 1 },
  timeline: { padding: 14, gap: 10 },
  step: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  stepText: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  marker: {
    width: MARKER,
    height: MARKER,
    flexShrink: 0,
    borderRadius: MARKER / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerDone: { backgroundColor: color.purple },
  markerCurrent: { backgroundColor: color.mango },
  markerUpcoming: { borderWidth: 2, borderColor: color.borderStrong, backgroundColor: color.white },
  markerDot: {
    width: MARKER_DOT,
    height: MARKER_DOT,
    borderRadius: MARKER_DOT / 2,
    backgroundColor: color.white,
  },
  rows: { paddingVertical: 6, paddingHorizontal: 14 },
  rowsTitle: { paddingVertical: 6 },
  decisionShadow: { borderRadius: radius.tile, boxShadow: shadow.button },
  decision: {
    borderRadius: radius.tile,
    padding: 16,
    gap: 8,
    overflow: 'hidden',
  },
});
