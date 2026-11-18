import { formatRupees } from '@kaithozhil/core';
import {
  AppText,
  Card,
  Gradient,
  Icon,
  SecondaryButton,
  Tappable,
  color,
  radius,
  shadow,
} from '@kaithozhil/ui';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BadgePageLayout } from '../components/BadgePageLayout';
import { DetailRow, PhotoPlaceholder } from '../components/Parts';
import { progressCopy as copy } from '../copy';
import { progressPercent } from '../quoteMoney';
import type { JobProgress, ProgressPayment } from '../types';

export type JobProgressScreenProps = {
  progress: JobProgress;
  onBack: () => void;
  onMessage?: () => void;
  onChanges?: () => void;
  onReportProblem?: () => void;
};

/** Customer · Job progress (design/source/JobProgress.dc.html). */
export function JobProgressScreen({
  progress,
  onBack,
  onMessage,
  onChanges,
  onReportProblem,
}: JobProgressScreenProps) {
  const lastDay = Math.max(progress.days.length - 1, 0);
  const [dayIndex, setDayIndex] = useState(progress.todayIndex ?? lastDay);
  const day = progress.days[dayIndex];
  const percent = progressPercent(progress.partsDone, progress.partsTotal);

  return (
    <BadgePageLayout
      title={copy.title}
      titleTamil={copy.titleTamil}
      backLabel={copy.back}
      onBack={onBack}
      badge={progress.status}
      badgeTone="purple"
      badgeLabel={copy.statusLabel(progress.status)}
      testID="progress"
    >
      {/* Shadow on the outer view; the gradient clips to its corners. */}
      <View style={styles.heroShadow}>
        <Gradient name="hero" style={styles.hero}>
          <View style={styles.heroTop}>
            <AppText size={13} color={color.lavenderText} style={styles.shrink}>
              {progress.summary}
            </AppText>
            <AppText size={12} weight={800} color={color.gold}>
              {copy.ends(progress.endsOn)}
            </AppText>
          </View>
          <AppText size={22} weight={800} color={color.white}>
            {copy.percentDone(percent)}
          </AppText>
          {/* The design marks the bar role="img" with its own label. */}
          <View
            style={styles.track}
            accessible
            accessibilityRole="image"
            accessibilityLabel={copy.percentLabel(percent)}
          >
            <View style={[styles.fill, { width: `${percent}%` }]} />
          </View>
          <AppText size={12} color={color.lavenderText}>
            {copy.partsDone(progress.partsDone, progress.partsTotal, progress.workerFirstName)}
          </AppText>
        </Gradient>
      </View>

      <View style={styles.days} accessibilityLabel={copy.dayGroupLabel}>
        {progress.days.map((item, index) => {
          const selected = index === dayIndex;
          return (
            <Tappable
              key={item.id}
              onPress={() => setDayIndex(index)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`${item.weekday} ${item.date}`}
              style={[styles.day, selected ? styles.dayOn : styles.dayOff]}
              testID={`progress-day-${index}`}
            >
              <AppText size={12} weight={700} color={selected ? color.white : color.ink}>
                {item.weekday}
              </AppText>
              <AppText
                size={18}
                weight={800}
                lineHeight={18}
                color={selected ? color.white : color.ink}
              >
                {item.date}
              </AppText>
            </Tappable>
          );
        })}
      </View>

      {day ? (
        <Card style={styles.dayCard}>
          <AppText size={15} weight={800} accessibilityRole="header">
            {copy.dayTitle(dayIndex + 1, progress.days.length, dayIndex === progress.todayIndex)}
          </AppText>
          <View style={styles.team}>
            <Icon name="users" size={14} color={color.muted} />
            <AppText size={12} color={color.muted} style={styles.shrink}>
              {day.team}
            </AppText>
          </View>
          <AppText size={13} lineHeight={13 * 1.45}>
            {day.note}
          </AppText>
          {day.photoCount > 0 ? <PhotoGrid count={day.photoCount} /> : null}
        </Card>
      ) : null}

      <Card style={styles.payments}>
        <AppText size={14} weight={800} accessibilityRole="header" style={styles.paymentsTitle}>
          {copy.paymentsTitle}
        </AppText>
        {progress.payments.map((payment) => (
          <PaymentRow key={payment.key} payment={payment} />
        ))}
      </Card>

      <View style={styles.actions}>
        <View style={styles.flex}>
          <SecondaryButton
            label={copy.message(progress.workerFirstName)}
            icon="messageSquare"
            onPress={onMessage}
            testID="progress-message"
          />
        </View>
        <View style={styles.flex}>
          <SecondaryButton
            label={copy.changes}
            icon="pencil"
            onPress={onChanges}
            testID="progress-changes"
          />
        </View>
      </View>

      <Tappable
        onPress={onReportProblem}
        accessibilityRole="link"
        style={styles.report}
        testID="progress-report"
      >
        <AppText size={14} weight={700} color={color.muted}>
          {copy.reportProblem}
        </AppText>
      </Tappable>
    </BadgePageLayout>
  );
}

const COLUMNS = 3;

/**
 * The design's 3-column grid. React Native has no CSS grid, so each row is a
 * flex row of three equal cells, and a short last row is padded with empty
 * cells so its tiles keep the same size.
 */
function PhotoGrid({ count }: { count: number }) {
  const rows = Math.ceil(count / COLUMNS);
  return (
    <View style={styles.photoGrid}>
      {Array.from({ length: rows }, (_, row) => (
        // Rows and cells never reorder, so their positions are safe keys.
        <View key={row} style={styles.photos}>
          {Array.from({ length: COLUMNS }, (_, column) => {
            const index = row * COLUMNS + column;
            return index < count ? (
              <PhotoPlaceholder
                key={column}
                index={index}
                label={copy.photoLabel(index + 1)}
                iconSize={22}
                borderRadius={PHOTO_RADIUS}
              />
            ) : (
              <View key={column} style={styles.flex} />
            );
          })}
        </View>
      ))}
    </View>
  );
}

function PaymentRow({ payment }: { payment: ProgressPayment }) {
  const amount = formatRupees(payment.amountRupees);
  const paid = payment.paidOn !== undefined;
  return (
    <DetailRow
      variant="summary"
      label={copy.stageTitles[payment.key]}
      labelDetail={
        payment.paidOn !== undefined ? copy.paidDetail(payment.paidOn) : copy.completionDetail
      }
      value={paid ? `${amount}${copy.paidMark}` : amount}
      valueLabel={paid ? `${amount} ${copy.paidLabel}` : amount}
    />
  );
}

/** The design's 12pt corners on the progress photos (radius.input has the same value). */
const PHOTO_RADIUS = radius.input;
const DAY_HEIGHT = 64;
const BAR_HEIGHT = 10;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  shrink: { flexShrink: 1 },
  heroShadow: {
    borderRadius: radius.tile,
    boxShadow: shadow.button,
  },
  hero: {
    borderRadius: radius.tile,
    padding: 16,
    gap: 10,
    overflow: 'hidden',
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  track: {
    height: BAR_HEIGHT,
    borderRadius: BAR_HEIGHT / 2,
    backgroundColor: color.onHeroPanelBorder,
    overflow: 'hidden',
  },
  fill: {
    height: BAR_HEIGHT,
    borderRadius: BAR_HEIGHT / 2,
    backgroundColor: color.gold,
  },
  days: {
    flexDirection: 'row',
    gap: 6,
  },
  day: {
    flex: 1,
    height: DAY_HEIGHT,
    borderRadius: radius.chipSquare,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  dayOn: {
    borderWidth: 2,
    borderColor: color.purple,
    backgroundColor: color.purple,
  },
  dayOff: {
    borderWidth: 1,
    borderColor: color.borderStrong,
    backgroundColor: color.white,
  },
  dayCard: {
    padding: 14,
    gap: 10,
  },
  team: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  photoGrid: { gap: 8 },
  photos: {
    flexDirection: 'row',
    gap: 8,
  },
  payments: {
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  paymentsTitle: { paddingVertical: 6 },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  report: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
