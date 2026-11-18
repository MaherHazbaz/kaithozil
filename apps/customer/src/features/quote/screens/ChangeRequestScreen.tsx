import { formatRupees } from '@kaithozhil/core';
import {
  AppText,
  Card,
  Chip,
  Icon,
  IconBox,
  InfoNote,
  PrimaryButton,
  Ripple,
  SecondaryButton,
  color,
  fontFamily,
  radius,
} from '@kaithozhil/ui';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { PageLayout } from '@/components/PageLayout';
import { DetailRow, PhotoPlaceholder } from '../components/Parts';
import { changeCopy as copy } from '../copy';
import { useAsyncAction } from '../hooks/useAsyncAction';
import { changedTotal, parseRupeesInput } from '../quoteMoney';
import type { ChangeDraft, ChangeJob, ChangeProposal } from '../types';

type CommonProps = {
  job: ChangeJob;
  onBack: () => void;
  /** "Back to the job" once the request is sent or answered. */
  onBackToJob?: () => void;
};

export type WorkerChangeProps = CommonProps & {
  side: 'worker';
  /** Starting values. The design opens with ₹250 and "+30 min". */
  initialDraft?: Partial<ChangeDraft>;
  onAddPhoto?: () => void;
  /** Sends the request to the customer. Rejects to stay on the form. */
  onPropose: (proposal: Omit<ChangeProposal, 'title' | 'hasPhoto'>) => Promise<void>;
};

export type CustomerChangeProps = CommonProps & {
  side: 'customer';
  proposal: ChangeProposal;
  onAsk?: () => void;
  /** Records the customer's approval. Resolves with the time it was recorded ("4:44 PM"). */
  onApprove: () => Promise<{ approvedAt: string }>;
  onDecline: () => Promise<void>;
};

/** `side` picks the half of the design: the worker proposes, the customer responds. */
export type ChangeRequestScreenProps = WorkerChangeProps | CustomerChangeProps;

/**
 * Shared · Change request (design/source/ChangeRequest.dc.html). The worker
 * proposes extra work; the price changes only when the customer approves it.
 */
export function ChangeRequestScreen(props: ChangeRequestScreenProps) {
  const { job, onBack } = props;
  return (
    <PageLayout title={copy.title} titleTamil={copy.titleTamil} onBack={onBack}>
      <View style={styles.job} accessible>
        <IconBox icon={job.icon} tone="lavender" size={36} />
        <View style={styles.shrink}>
          <AppText size={13} weight={700}>
            {job.title}
          </AppText>
          <AppText size={12} color={color.muted}>
            {copy.agreedSoFar(formatRupees(job.agreedRupees))}
          </AppText>
        </View>
      </View>
      {props.side === 'worker' ? <WorkerChange {...props} /> : <CustomerChange {...props} />}
    </PageLayout>
  );
}

const DEFAULT_EXTRA_RUPEES = 250;
const DEFAULT_TIME = copy.times[1].key;

function WorkerChange({
  job,
  initialDraft,
  onAddPhoto,
  onPropose,
  onBackToJob,
}: WorkerChangeProps) {
  const [description, setDescription] = useState(initialDraft?.description ?? '');
  const [extraRupees, setExtraRupees] = useState(initialDraft?.extraRupees ?? DEFAULT_EXTRA_RUPEES);
  const [timeKey, setTimeKey] = useState(initialDraft?.timeKey ?? DEFAULT_TIME);
  const [sent, setSent] = useState(false);
  const { busy, run } = useAsyncAction();

  const extraTime = copy.times.find((option) => option.key === timeKey)?.label ?? '';
  const extra = copy.extra(formatRupees(extraRupees));
  const newTotal = formatRupees(changedTotal(job.agreedRupees, extraRupees));

  const send = () => {
    void run(async () => {
      await onPropose({ description: description.trim(), extraRupees, extraTime });
      setSent(true);
    });
  };

  if (sent) {
    return (
      <>
        <View style={styles.waiting}>
          <View style={styles.rippleBox}>
            {/* Waves spread from behind the disc; hidden when reduce motion is on. */}
            <Ripple kind="waitingRipple" size={WAITING_DISC} color={color.waveGold} />
            <View style={styles.waitingDisc}>
              <Icon name="clock" size={40} color={color.mangoText} />
            </View>
          </View>
          <AppText size={20} weight={800} align="center" accessibilityRole="header">
            {copy.waitingTitle(job.customerFirstName)}
          </AppText>
          <AppText size={14} lineHeight={14 * 1.5} align="center" style={styles.waitingBody}>
            {copy.waitingBody(extra, extraTime)}
          </AppText>
        </View>
        <SecondaryButton label={copy.backToJob} onPress={onBackToJob} testID="change-back-to-job" />
      </>
    );
  }

  return (
    <>
      <AppText size={15} weight={800} accessibilityRole="header">
        {copy.proposeHeading(job.customerFirstName)}
        <AppText size={12} weight={600} color={color.muted}>
          {copy.proposeHeadingTamil}
        </AppText>
      </AppText>

      <View style={styles.field}>
        <AppText size={13} weight={700} color={color.muted}>
          {copy.whatLabel}
        </AppText>
        <TextInput
          value={description}
          onChangeText={setDescription}
          multiline
          placeholder={copy.whatHint}
          placeholderTextColor={color.placeholder}
          accessibilityLabel={copy.whatLabel}
          maxFontSizeMultiplier={1.3}
          style={styles.description}
          testID="change-description"
        />
      </View>

      <View style={styles.amountRow}>
        <View style={styles.shrink}>
          <AppText size={14} weight={700}>
            {copy.amountLabel}
          </AppText>
          <AppText size={11} color={color.muted}>
            {copy.amountDetail}
          </AppText>
        </View>
        <View style={styles.amountBox}>
          <AppText size={15} weight={800} color={color.muted}>
            {copy.rupee}
          </AppText>
          <TextInput
            value={String(extraRupees)}
            onChangeText={(text) => setExtraRupees(parseRupeesInput(text))}
            // Opens the number pad; the parser still drops anything that is not a digit.
            keyboardType="number-pad"
            accessibilityLabel={`${copy.amountLabel}, ${copy.amountDetail}`}
            maxFontSizeMultiplier={1.3}
            style={styles.amountInput}
            testID="change-amount"
          />
        </View>
      </View>

      <View style={styles.section}>
        <AppText size={14} weight={700}>
          {copy.timeLabel}
        </AppText>
        <View style={styles.chips} accessibilityLabel={copy.timeLabel}>
          {copy.times.map((option) => (
            <Chip
              key={option.key}
              label={option.label}
              selected={timeKey === option.key}
              onPress={() => setTimeKey(option.key)}
              testID={`change-time-${option.key}`}
            />
          ))}
        </View>
      </View>

      <SecondaryButton
        label={copy.addPhoto}
        icon="camera"
        onPress={onAddPhoto}
        testID="change-add-photo"
      />

      <InfoNote tone="info" icon="lock">
        {copy.newTotalBefore(job.customerFirstName)}
        <AppText weight={700}>{newTotal}</AppText>
        {copy.newTotalAfter}
      </InfoNote>

      <PrimaryButton
        label={copy.send(job.customerFirstName)}
        disabled={busy}
        onPress={send}
        testID="change-send"
      />
    </>
  );
}

type Answer = { kind: 'approved'; at: string } | { kind: 'declined' } | null;

function CustomerChange({
  job,
  proposal,
  onAsk,
  onApprove,
  onDecline,
  onBackToJob,
}: CustomerChangeProps) {
  const [answer, setAnswer] = useState<Answer>(null);
  const { busy, run } = useAsyncAction();
  const agreed = formatRupees(job.agreedRupees);
  const newTotal = formatRupees(changedTotal(job.agreedRupees, proposal.extraRupees));

  const approve = () => {
    void run(async () => {
      const { approvedAt } = await onApprove();
      setAnswer({ kind: 'approved', at: approvedAt });
    });
  };
  const decline = () => {
    void run(async () => {
      await onDecline();
      setAnswer({ kind: 'declined' });
    });
  };

  if (answer) {
    return (
      <>
        {answer.kind === 'approved' ? (
          <View style={styles.approved}>
            <View style={styles.approvedRow}>
              <View style={styles.tick}>
                <Icon name="check" size={14} color={color.white} strokeWidth={3} />
              </View>
              <View style={styles.shrink}>
                <AppText size={13} weight={700} accessibilityRole="header">
                  {copy.approvedTitle(answer.at)}
                </AppText>
                <AppText size={11} color={color.muted}>
                  {copy.approvedDetail(newTotal)}
                </AppText>
              </View>
            </View>
          </View>
        ) : (
          <Card style={styles.declined}>
            <AppText size={16} weight={800} align="center" accessibilityRole="header">
              {copy.declinedTitle}
            </AppText>
            <AppText size={13} color={color.muted} align="center" lineHeight={13 * 1.45}>
              {copy.declinedBody(agreed, job.workerFirstName)}
            </AppText>
          </Card>
        )}
        <SecondaryButton label={copy.backToJob} onPress={onBackToJob} testID="change-back-to-job" />
      </>
    );
  }

  return (
    <>
      <Card style={styles.request}>
        <AppText size={12} weight={700} color={color.muted}>
          {copy.asks(job.workerFirstName)}
        </AppText>
        <AppText size={16} weight={800} accessibilityRole="header">
          {proposal.title}
        </AppText>
        <AppText size={13} lineHeight={13 * 1.45}>
          {copy.quoted(proposal.description)}
        </AppText>
        {proposal.hasPhoto ? (
          <PhotoPlaceholder
            index={0}
            label={copy.photoLabel}
            iconSize={28}
            height={120}
            borderRadius={radius.note}
          />
        ) : null}
      </Card>

      <Card style={styles.summary}>
        <DetailRow variant="summary" label={copy.agreedRow} value={agreed} />
        <DetailRow
          variant="summary"
          label={copy.extraRow}
          labelDetail={copy.amountDetail}
          value={copy.extra(formatRupees(proposal.extraRupees))}
        />
        <DetailRow variant="summary" label={copy.timeRow} value={proposal.extraTime} />
        <View style={styles.totalRow} accessible>
          <AppText size={15} weight={800}>
            {copy.newTotal}
          </AppText>
          <AppText size={22} weight={800} color={color.purple} testID="change-new-total">
            {newTotal}
          </AppText>
        </View>
      </Card>

      <PrimaryButton
        label={copy.approve}
        disabled={busy}
        onPress={approve}
        testID="change-approve"
      />
      <View style={styles.pair}>
        <View style={styles.flex}>
          <SecondaryButton
            label={copy.askQuestion}
            icon="messageSquare"
            onPress={onAsk}
            testID="change-ask"
          />
        </View>
        <View style={styles.flex}>
          <SecondaryButton
            label={copy.decline}
            tone="ink"
            disabled={busy}
            onPress={decline}
            testID="change-decline"
          />
        </View>
      </View>
    </>
  );
}

// Two lines of 14pt text plus padding and border: the design's `<textarea rows="2">`.
const DESCRIPTION_HEIGHT = 57;
const WAITING_DISC = 88;
/** The design's 167pt box: room for the waves to spread (88 x 1.9). */
const RIPPLE_BOX = 167;
const TICK = 24;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  shrink: { flexShrink: 1 },
  job: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: color.pageBackground,
    borderRadius: radius.note,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  field: { gap: 6 },
  description: {
    height: DESCRIPTION_HEIGHT,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: color.borderStrong,
    backgroundColor: color.white,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: fontFamily.body,
    fontSize: 14,
    color: color.ink,
    // Android centres multiline text vertically and pads it unless told not to.
    textAlignVertical: 'top',
    includeFontPadding: false,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  amountBox: {
    width: 140,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: color.borderStrong,
    backgroundColor: color.white,
    paddingHorizontal: 12,
  },
  amountInput: {
    flex: 1,
    height: '100%',
    padding: 0,
    textAlign: 'right',
    fontFamily: fontFamily.body,
    fontSize: 16,
    fontWeight: '800',
    color: color.ink,
    includeFontPadding: false,
  },
  section: { gap: 8 },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  waiting: {
    alignItems: 'center',
    gap: 10,
    paddingTop: 26,
    paddingBottom: 6,
  },
  rippleBox: {
    width: RIPPLE_BOX,
    height: RIPPLE_BOX,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waitingDisc: {
    width: WAITING_DISC,
    height: WAITING_DISC,
    borderRadius: WAITING_DISC / 2,
    backgroundColor: color.mangoTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waitingBody: { maxWidth: 300 },
  request: {
    padding: 14,
    gap: 10,
  },
  summary: {
    paddingVertical: 4,
    paddingHorizontal: 14,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingVertical: 10,
  },
  pair: {
    flexDirection: 'row',
    gap: 8,
  },
  approved: {
    borderWidth: 2,
    borderColor: color.purple,
    borderRadius: radius.choiceCard,
    backgroundColor: color.white,
    padding: 14,
    gap: 8,
  },
  approvedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tick: {
    width: TICK,
    height: TICK,
    borderRadius: TICK / 2,
    backgroundColor: color.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  declined: {
    padding: 14,
    gap: 10,
    alignItems: 'center',
  },
});
