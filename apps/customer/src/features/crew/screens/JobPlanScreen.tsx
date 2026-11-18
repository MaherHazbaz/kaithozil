import {
  AppText,
  Card,
  Icon,
  InfoNote,
  PrimaryButton,
  Ripple,
  SecondaryButton,
  Stepper,
  Tappable,
  color,
  fontFamily,
  radius,
} from '@kaithozhil/ui';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { useAsyncAction } from '@/features/quote/hooks/useAsyncAction';

import { CrewLayout } from '../components/CrewLayout';
import { HeroCard } from '../components/Parts';
import { crewBookCopy, jobPlanCopy as copy, roleCopy } from '../copy';
import { CREW_DAYS, CREW_ROLES, WORKERS_PER_ROLE, totalWorkers, workerDays } from '../crewPlan';
import { usePlanChanges } from '../hooks/usePlanChanges';
import type { JobPlan, JobPlanStatus, PlanChanges, RoleCounts } from '../types';

/** What the screen shows: the server's status, plus the customer's own "Suggest changes" form. */
type PlanView = JobPlanStatus | 'edit';

export type JobPlanScreenProps = {
  plan: JobPlan;
  onBack: () => void;
  /**
   * Confirms the plan on the server and resolves with the time it was
   * recorded ("4:10 PM"). Rejects to stay on the plan. Takes no money: the
   * crew is paid day by day, from attendance.
   */
  onConfirm: () => Promise<{ confirmedAt: string }>;
  /** Sends the counter-proposal. Nothing changes until the mestri accepts it. */
  onSendChanges: (changes: PlanChanges) => Promise<void>;
  onGoToBookings?: () => void;
  onSeeCrew?: () => void;
};

/** Customer · Job plan (design/source/JobPlan.dc.html). */
export function JobPlanScreen({
  plan,
  onBack,
  onConfirm,
  onSendChanges,
  onGoToBookings,
  onSeeCrew,
}: JobPlanScreenProps) {
  const [view, setView] = useState<PlanView>(plan.status);
  const [confirmedAt, setConfirmedAt] = useState(plan.customerConfirmedAt);
  const changes = usePlanChanges(plan);
  const { busy, run } = useAsyncAction();
  const name = plan.mestriFirstName;

  const status =
    view === 'confirmed'
      ? copy.statusConfirmed
      : view === 'waiting'
        ? copy.statusWaiting(name)
        : copy.statusReview;

  const confirm = () =>
    void run(async () => {
      const result = await onConfirm();
      setConfirmedAt(result.confirmedAt);
      setView('confirmed');
    });

  const send = () =>
    void run(async () => {
      await onSendChanges(changes.draft);
      setView('waiting');
    });

  const cancel = () => {
    changes.reset();
    setView('review');
  };

  return (
    <CrewLayout
      title={copy.title}
      titleTamil={copy.titleTamil}
      backLabel={copy.back}
      onBack={onBack}
      badge={status}
      badgeLabel={copy.statusLabel(status)}
      testID="plan"
    >
      {view === 'review' ? (
        <>
          <HeroCard corner="card" style={styles.proposed}>
            <View style={styles.goldAvatar}>
              <AppText size={14} weight={800} color={color.purpleDeep}>
                {plan.mestriInitials}
              </AppText>
            </View>
            <View style={styles.proposedText}>
              <AppText size={15} weight={800} color={color.white} accessibilityRole="header">
                {copy.proposed(name)}
              </AppText>
              <AppText size={12} color={color.lavenderText}>
                {plan.context}
              </AppText>
            </View>
          </HeroCard>

          <PlanSummary plan={plan} />

          <View style={styles.bubble}>
            <AppText size={11} weight={700} color={color.muted}>
              {copy.messageFrom(name)}
            </AppText>
            <AppText size={14} lineHeight={14 * 1.4}>
              {plan.message}
            </AppText>
          </View>

          <InfoNote tone="info" icon="lock">
            {copy.lockNote}
          </InfoNote>

          <PrimaryButton
            label={copy.confirm}
            icon="check"
            iconSize={20}
            iconStrokeWidth={3}
            disabled={busy}
            onPress={confirm}
            testID="plan-confirm"
          />
          <SecondaryButton
            label={copy.suggest}
            icon="pencil"
            disabled={busy}
            onPress={() => setView('edit')}
            testID="plan-suggest"
          />
        </>
      ) : null}

      {view === 'edit' ? (
        <>
          <AppText size={15} weight={800} accessibilityRole="header">
            {copy.editHeading}
            <AppText size={12} weight={600} color={color.muted}>
              {copy.editHeadingTamil}
            </AppText>
          </AppText>

          <Card style={styles.editCard}>
            {CREW_ROLES.map((role) => (
              <EditRow
                key={role}
                label={roleCopy[role].plural}
                tamil={roleCopy[role].tamil}
                value={changes.draft.counts[role]}
                onChange={(count) => changes.setRoleCount(role, count)}
                min={WORKERS_PER_ROLE.min}
                max={WORKERS_PER_ROLE.max}
              />
            ))}
            <EditRow
              label={copy.days}
              tamil={copy.daysTamil}
              value={changes.draft.days}
              onChange={changes.setDays}
              min={CREW_DAYS.min}
              max={CREW_DAYS.max}
            />
          </Card>

          <View style={styles.field}>
            <AppText size={13} weight={700} color={color.muted}>
              {copy.messageLabel(name)}
            </AppText>
            <TextInput
              value={changes.draft.message}
              onChangeText={changes.setMessage}
              multiline
              placeholder={copy.messageHint}
              placeholderTextColor={color.placeholder}
              accessibilityLabel={copy.messageLabel(name)}
              maxFontSizeMultiplier={1.3}
              style={styles.message}
              testID="plan-message"
            />
          </View>

          <PrimaryButton
            label={copy.send(name)}
            disabled={busy || !changes.canSend}
            accessibilityHint={changes.canSend ? undefined : crewBookCopy.noWorkersHint}
            onPress={send}
            testID="plan-send"
          />
          <Tappable
            onPress={cancel}
            accessibilityRole="button"
            accessibilityLabel={copy.cancel}
            style={styles.textButton}
            testID="plan-cancel"
          >
            <AppText size={14} weight={700} color={color.purple}>
              {copy.cancel}
            </AppText>
          </Tappable>
        </>
      ) : null}

      {view === 'waiting' ? (
        <>
          <View style={styles.waiting}>
            {/* Decorative: the title below says the same thing to screen readers. */}
            <View
              style={styles.rippleBox}
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
            >
              {/* Waves spread from behind the disc; hidden when reduce motion is on. */}
              <Ripple kind="waitingRipple" size={WAITING_DISC} color={color.waveGold} />
              <View style={styles.waitingDisc}>
                <Icon name="clock" size={40} color={color.mangoText} />
              </View>
            </View>
            <AppText size={20} weight={800} align="center" accessibilityRole="header">
              {copy.sentTitle(name)}
            </AppText>
            <AppText size={13} color={color.muted} align="center">
              {copy.sentTitleTamil}
            </AppText>
            <AppText size={14} lineHeight={14 * 1.5} align="center" style={styles.waitingBody}>
              {copy.sentBody}
            </AppText>
          </View>
          <SecondaryButton
            label={copy.toBookings}
            onPress={onGoToBookings}
            testID="plan-bookings"
          />
        </>
      ) : null}

      {view === 'confirmed' ? (
        <>
          <View style={styles.confirmed} testID="plan-confirmed">
            <View style={styles.confirmedRow}>
              <View style={styles.tick}>
                <Icon name="check" size={14} color={color.white} strokeWidth={3} />
              </View>
              <View style={styles.proposedText}>
                <AppText size={13} weight={700} accessibilityRole="header">
                  {copy.confirmedByYou(confirmedAt ?? '')}
                </AppText>
                <AppText size={11} color={color.muted}>
                  {copy.confirmedByMestri(name, plan.mestriConfirmedAt)}
                </AppText>
              </View>
            </View>
            <AppText size={13} lineHeight={13 * 1.45}>
              {copy.startsBefore}
              <AppText weight={700}>{plan.startsAt}</AppText>
              {copy.startsAfter}
            </AppText>
          </View>

          <PlanSummary plan={plan} />

          <PrimaryButton label={copy.seeCrew} onPress={onSeeCrew} testID="plan-see-crew" />
        </>
      ) : null}
    </CrewLayout>
  );
}

/** The plan's numbers: workers per role, days, daily rate and the total (padding 6 14). */
function PlanSummary({ plan }: { plan: { counts: RoleCounts; days: number; dateRange: string } }) {
  const total = totalWorkers(plan.counts);
  return (
    <Card style={styles.summary} testID="plan-summary">
      {CREW_ROLES.map((role) => (
        <PlanRow
          key={role}
          label={`${roleCopy[role].plural} · ${roleCopy[role].tamil}`}
          value={String(plan.counts[role])}
        />
      ))}
      <PlanRow label={copy.days} detail={plan.dateRange} value={String(plan.days)} />
      <PlanRow label={copy.dailyRate} detail={copy.dailyRateDetail} value={copy.dailyRateValue} />
      <View style={styles.totalRow}>
        <AppText size={14} weight={800}>
          {copy.teamLine(total, plan.days)}
        </AppText>
        <AppText size={14} weight={800} color={color.purple}>
          {copy.workerDays(workerDays(plan.counts, plan.days))}
        </AppText>
      </View>
      <AppText size={11} color={color.muted} style={styles.payNote}>
        {copy.payNote}
      </AppText>
    </Card>
  );
}

function PlanRow({ label, detail, value }: { label: string; detail?: string; value: string }) {
  return (
    // One element for screen readers: "Masons · கொத்தனார், 2".
    <View
      style={styles.planRow}
      accessible
      accessibilityLabel={[label, detail, value].filter(Boolean).join(', ')}
    >
      <View style={styles.planLabel}>
        <AppText size={13} color={color.muted}>
          {label}
        </AppText>
        {detail ? (
          <AppText size={11} color={color.muted}>
            {detail}
          </AppText>
        ) : null}
      </View>
      <AppText size={13} weight={800} align="right" style={styles.planValue}>
        {value}
      </AppText>
    </View>
  );
}

type EditRowProps = {
  label: string;
  tamil: string;
  value: number;
  onChange: (next: number) => void;
  min: number;
  max: number;
};

/** One "Suggest changes" row: name, Tamil name and a stepper (padding 8 0). */
function EditRow({ label, tamil, value, onChange, min, max }: EditRowProps) {
  return (
    <View style={styles.editRow}>
      <View style={styles.planLabel}>
        <AppText size={14} weight={700}>
          {label}
        </AppText>
        <AppText size={11} color={color.muted}>
          {tamil}
        </AppText>
      </View>
      <Stepper
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        decreaseLabel={copy.less(label)}
        increaseLabel={copy.more(label)}
        valueSize={18}
        valueWidth={30}
      />
    </View>
  );
}

// Two lines of 14pt text plus padding and border: the design's `<textarea rows="2">`.
const MESSAGE_HEIGHT = 57;
const WAITING_DISC = 88;
/** The design's 167pt box: room for the waves to spread (88 x 1.9). */
const RIPPLE_BOX = 167;
const TICK = 24;
const GOLD_AVATAR = 44;

const styles = StyleSheet.create({
  proposed: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  goldAvatar: {
    width: GOLD_AVATAR,
    height: GOLD_AVATAR,
    borderRadius: GOLD_AVATAR / 2,
    flexShrink: 0,
    backgroundColor: color.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proposedText: { flexShrink: 1, gap: 2 },
  summary: {
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  planRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: color.border,
  },
  planLabel: { flexShrink: 1 },
  planValue: { flexShrink: 1 },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 12,
    paddingTop: 10,
    paddingBottom: 6,
  },
  payNote: { paddingBottom: 6 },
  // The design's `box-shadow` on this bubble is not valid CSS, so the browser
  // draws it without a shadow. Matched as drawn (as on QuoteView).
  bubble: {
    alignSelf: 'flex-start',
    maxWidth: '92%',
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.borderSoft,
    borderRadius: radius.card,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 3,
  },
  editCard: {
    paddingVertical: 4,
    paddingHorizontal: 14,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: color.border,
  },
  field: { gap: 6 },
  message: {
    height: MESSAGE_HEIGHT,
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
  textButton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waiting: {
    alignItems: 'center',
    gap: 10,
    paddingTop: 30,
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
  confirmed: {
    backgroundColor: color.white,
    borderWidth: 2,
    borderColor: color.purple,
    borderRadius: radius.choiceCard,
    padding: 14,
    gap: 8,
  },
  confirmedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tick: {
    width: TICK,
    height: TICK,
    borderRadius: TICK / 2,
    flexShrink: 0,
    backgroundColor: color.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
