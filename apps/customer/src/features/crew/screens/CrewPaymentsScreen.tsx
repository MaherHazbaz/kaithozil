import {
  AppText,
  Card,
  InfoNote,
  PrimaryButton,
  StatusPill,
  Tappable,
  color,
} from '@kaithozhil/ui';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useAsyncAction } from '@/features/quote/hooks/useAsyncAction';

import { CrewLayout } from '../components/CrewLayout';
import { HeroCard } from '../components/Parts';
import { crewPaymentsCopy as copy, roleCopy } from '../copy';
import { firstDueDay, formatHalfDays, paidPercent } from '../crewPlan';
import type { CrewDay, CrewPayments } from '../types';

export type CrewPaymentsScreenProps = {
  payments: CrewPayments;
  onBack: () => void;
  /**
   * "Pay for Wed 19 Nov". HOW the customer pays is still the owner's decision
   * (gateway or direct UPI), so this only reports the tap. The day turns
   * "Paid ✓" only when the server says so: the screen never marks it itself.
   */
  onPayDay: (dayId: string) => Promise<void>;
  /** "Attendance looks wrong? Report it". */
  onReport?: () => void;
};

/**
 * Customer · Daily crew payments (design/source/CrewPayments.dc.html).
 *
 * Every amount here is a placeholder ([PAID SO FAR], [DAY TOTAL], [RATE]):
 * the rates are not decided, and once they are, the server works out the
 * amounts from attendance. The phone never calculates what is owed.
 */
export function CrewPaymentsScreen({
  payments,
  onBack,
  onPayDay,
  onReport,
}: CrewPaymentsScreenProps) {
  const due = firstDueDay(payments.days);
  // The design opens the day that is due; one day is open at a time.
  const [openId, setOpenId] = useState<string | undefined>(due?.id);
  const { busy, run } = useAsyncAction();
  const percent = paidPercent(payments.paidDays, payments.totalDays);
  const paidLine = copy.paidDays(payments.paidDays, payments.totalDays);

  return (
    <CrewLayout
      title={copy.title}
      titleTamil={copy.titleTamil}
      backLabel={copy.back}
      onBack={onBack}
      testID="crew-pay"
    >
      <HeroCard corner="tile" style={styles.hero}>
        <AppText size={13} color={color.lavenderText}>
          {payments.context}
        </AppText>
        <View style={styles.heroRow}>
          <AppText size={22} weight={800} color={color.white} style={styles.shrink}>
            {paidLine}
          </AppText>
          <AppText size={13} weight={800} color={color.gold}>
            {copy.paidSoFar}
          </AppText>
        </View>
        {/* The design marks the bar role="img" with its own label. */}
        <View
          style={styles.track}
          accessible
          accessibilityRole="image"
          accessibilityLabel={paidLine}
          testID="crew-pay-bar"
        >
          <View style={[styles.fill, { width: `${percent}%` }]} />
        </View>
      </HeroCard>

      {payments.days.length > 0 ? (
        <Card style={styles.days}>
          {payments.days.map((day) => (
            <DayRow
              key={day.id}
              day={day}
              mestriFirstName={payments.mestriFirstName}
              open={openId === day.id}
              onToggle={() => setOpenId((current) => (current === day.id ? undefined : day.id))}
            />
          ))}
        </Card>
      ) : null}

      <InfoNote tone="info" icon="users">
        {copy.shareBefore}
        <AppText weight={700}>{copy.shareBold}</AppText>
        {copy.shareAfter}
      </InfoNote>

      {due ? (
        <PrimaryButton
          label={copy.pay(due.date)}
          disabled={busy}
          onPress={() => void run(() => onPayDay(due.id))}
          testID="crew-pay-day"
        />
      ) : null}

      <Tappable
        onPress={onReport}
        accessibilityRole="link"
        style={styles.textLink}
        testID="crew-pay-report"
      >
        <AppText size={14} weight={700} color={color.muted}>
          {copy.report}
        </AppText>
      </Tappable>
    </CrewLayout>
  );
}

type DayRowProps = {
  day: CrewDay;
  mestriFirstName: string;
  open: boolean;
  onToggle: () => void;
};

/** One day: date, attendance summary, total and status; opens to the attendance lines. */
function DayRow({ day, mestriFirstName, open, onToggle }: DayRowProps) {
  const status = copy.status[day.status];
  return (
    <View>
      <Tappable
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={[day.date, day.summary, copy.dayTotal, copy.statusLabel[day.status]]
          .filter(Boolean)
          .join(', ')}
        style={styles.dayRow}
        testID={`crew-pay-${day.id}`}
      >
        <View style={styles.dayText}>
          <AppText size={14} weight={800}>
            {day.date}
          </AppText>
          <AppText size={12} color={color.muted}>
            {day.summary}
          </AppText>
        </View>
        <View style={styles.dayEnd}>
          <AppText size={14} weight={800}>
            {copy.dayTotal}
          </AppText>
          {status ? (
            <StatusPill label={status} tone={day.status === 'paid' ? 'purple' : 'mango'} />
          ) : null}
        </View>
      </Tappable>
      {open ? (
        <View style={styles.detail} testID={`crew-pay-${day.id}-detail`}>
          {day.attendance.map((line) => (
            <View key={line.role} style={styles.detailLine}>
              <AppText size={12} color={color.muted}>
                {copy.roleLine(roleCopy[line.role].plural, formatHalfDays(line.halfDays))}
              </AppText>
              <AppText size={12} weight={700}>
                {copy.rateEach}
              </AppText>
            </View>
          ))}
          <AppText size={11} color={color.muted} style={styles.markedAt}>
            {copy.markedAt(mestriFirstName, day.markedAt)}
          </AppText>
        </View>
      ) : null}
    </View>
  );
}

const BAR = 10;

const styles = StyleSheet.create({
  shrink: { flexShrink: 1 },
  hero: { padding: 16, gap: 8 },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 12,
  },
  track: {
    height: BAR,
    borderRadius: BAR / 2,
    // rgba(255,255,255,0.18) in the design: the same white as the panel borders on purple.
    backgroundColor: color.onHeroPanelBorder,
    overflow: 'hidden',
  },
  fill: {
    height: BAR,
    borderRadius: BAR / 2,
    backgroundColor: color.gold,
  },
  days: {
    paddingVertical: 2,
    paddingHorizontal: 14,
  },
  dayRow: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: color.border,
  },
  dayText: { flexGrow: 1, flexShrink: 1, gap: 2 },
  dayEnd: { alignItems: 'flex-end', gap: 4, flexShrink: 0 },
  detail: {
    paddingTop: 8,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: color.border,
  },
  detailLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 3,
  },
  markedAt: { paddingTop: 4 },
  textLink: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
