import {
  AppText,
  Card,
  IconBox,
  Icon,
  InfoNote,
  PrimaryButton,
  SecondaryButton,
  StatusPill,
  color,
} from '@kaithozhil/ui';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BadgePageLayout } from '@/features/quote/components/BadgePageLayout';
import { DetailRow } from '@/features/quote/components/Parts';
import { useAsyncAction } from '@/features/quote/hooks/useAsyncAction';

import { AttendanceCalendar } from '../components/AttendanceCalendar';
import { HousekeeperCard, RowsCard, TextLink } from '../components/Parts';
import { planCopy as copy } from '../copy';
import type { RegularHelp } from '../types';

export type RegularHelpScreenProps = {
  help: RegularHelp;
  /** Default false. Tests and the dev states can show the paused note. */
  initialPaused?: boolean;
  onBack: () => void;
  onMessage?: () => void;
  onOpenLeave?: (leaveId: string) => void;
  /**
   * "Pay for November on 1 Dec". PAYMENTS ARE NOT BUILT: the route passes a
   * callback that resolves without doing anything until the owner decides
   * between a gateway and direct UPI.
   */
  onPay: () => Promise<void>;
  onChangeDays?: () => void;
  /** Pauses visits from tomorrow on the server; rejects to stay unpaused. */
  onPause: () => Promise<void>;
  onResume: () => Promise<void>;
  onReportProblem?: () => void;
  onEnd?: () => void;
};

/** Customer · Regular help (design/source/HousekeepingPlan.dc.html). */
export function RegularHelpScreen({
  help,
  initialPaused = false,
  onBack,
  onMessage,
  onOpenLeave,
  onPay,
  onChangeDays,
  onPause,
  onResume,
  onReportProblem,
  onEnd,
}: RegularHelpScreenProps) {
  const [paused, setPaused] = useState(initialPaused);
  const { busy, run } = useAsyncAction();
  const { housekeeper, pay, pendingLeave } = help;
  const firstName = housekeeper.firstName;

  const setPausedOnServer = (action: () => Promise<void>, next: boolean) => {
    void run(async () => {
      await action();
      setPaused(next);
    });
  };

  return (
    <BadgePageLayout
      title={copy.title}
      titleTamil={copy.titleTamil}
      backLabel={copy.back}
      onBack={onBack}
      badge={copy.active}
      badgeTone="purple"
      badgeLabel={copy.activeLabel}
      testID="help"
    >
      <HousekeeperCard
        housekeeper={housekeeper}
        subtitle={help.subtitle}
        verifiedLabel={copy.verified}
        onMessage={onMessage}
        messageLabel={copy.message(firstName)}
        testID="help-housekeeper"
      />

      {pendingLeave ? (
        <Card
          onPress={() => onOpenLeave?.(pendingLeave.id)}
          accessibilityLabel={`${copy.leaveTitle(firstName)}. ${copy.leaveDetail(pendingLeave.dates)}. ${copy.waitingForYou}`}
          style={styles.leave}
          testID="help-leave"
        >
          <IconBox icon="calendar" tone="mango" size={40} />
          <View style={styles.leaveText}>
            <AppText size={15} weight={800}>
              {copy.leaveTitle(firstName)}
            </AppText>
            <AppText size={12} color={color.muted}>
              {copy.leaveDetail(pendingLeave.dates)}
            </AppText>
            <View style={styles.pill}>
              <StatusPill label={copy.waitingForYou} tone="mango" />
            </View>
          </View>
          <Icon name="chevronRight" size={18} color={color.muted} />
        </Card>
      ) : null}

      <RowsCard>
        {help.schedule.map((row) => (
          <DetailRow
            key={row.label}
            variant="summary"
            label={row.label}
            labelDetail={row.labelDetail}
            value={row.value}
          />
        ))}
      </RowsCard>

      <AttendanceCalendar month={help.attendance} housekeeperFirstName={firstName} />

      <RowsCard heading={pay.heading}>
        <DetailRow variant="summary" label={copy.daysWorked} value={String(pay.daysWorked)} />
        <DetailRow
          variant="summary"
          label={copy.paidLeave}
          labelDetail={copy.paidLeaveDetail}
          value={String(pay.paidLeave)}
        />
        <DetailRow
          variant="summary"
          label={copy.absent}
          labelDetail={copy.absentDetail}
          value={String(pay.absent)}
        />
        <View
          style={styles.total}
          accessible
          accessibilityLabel={`${copy.estimatedSoFar}, ${pay.estimate}`}
        >
          <AppText size={14} weight={800}>
            {copy.estimatedSoFar}
          </AppText>
          <AppText size={18} weight={800} color={color.purple}>
            {pay.estimate}
          </AppText>
        </View>
      </RowsCard>

      <PrimaryButton
        label={pay.payLabel}
        disabled={busy}
        onPress={() => void run(onPay)}
        testID="help-pay"
      />

      {paused ? (
        <InfoNote tone="warning" icon="pause">
          {copy.pausedNote(firstName)}
          <AppText
            weight={800}
            color={color.purple}
            underline
            accessibilityRole="link"
            onPress={busy ? undefined : () => setPausedOnServer(onResume, false)}
            testID="help-resume"
          >
            {copy.resume}
          </AppText>
        </InfoNote>
      ) : (
        <View style={styles.pair}>
          <View style={styles.flex}>
            <SecondaryButton
              label={copy.changeDays}
              icon="calendar"
              onPress={onChangeDays}
              testID="help-change-days"
            />
          </View>
          <View style={styles.flex}>
            <SecondaryButton
              label={copy.pause}
              icon="pause"
              disabled={busy}
              onPress={() => setPausedOnServer(onPause, true)}
              testID="help-pause"
            />
          </View>
        </View>
      )}

      <View style={styles.links}>
        <TextLink
          label={copy.reportProblem}
          tone="muted"
          onPress={onReportProblem}
          testID="help-report"
        />
        <TextLink label={copy.endArrangement} tone="muted" onPress={onEnd} testID="help-end" />
      </View>
    </BadgePageLayout>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  leave: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  leaveText: { flexGrow: 1, flexShrink: 1, minWidth: 0, gap: 3 },
  pill: { alignSelf: 'flex-start' },
  total: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingTop: 10,
    paddingBottom: 8,
  },
  pair: { flexDirection: 'row', gap: 8 },
  links: { gap: 2, alignItems: 'center' },
});
