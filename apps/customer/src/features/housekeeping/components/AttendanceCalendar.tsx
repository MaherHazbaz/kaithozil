import { AppText, Card, color, radius } from '@kaithozhil/ui';
import { StyleSheet, View } from 'react-native';

import { calendarWeeks } from '../attendance';
import { planCopy as copy } from '../copy';
import type { AttendanceMonth, AttendanceStatus } from '../types';

const CELL: Record<AttendanceStatus, { background: string; text: string; dashed: boolean }> = {
  worked: { background: color.lavender, text: color.purple, dashed: false },
  paidLeave: { background: color.mangoTint, text: color.mangoText, dashed: false },
  absent: { background: color.neutralTint, text: color.muted, dashed: false },
  dayOff: { background: color.white, text: color.disabledText, dashed: true },
  upcoming: { background: color.white, text: color.ink, dashed: true },
};

export type AttendanceCalendarProps = {
  month: AttendanceMonth;
  housekeeperFirstName: string;
};

/**
 * The month's attendance grid (HousekeepingPlan.dc.html, DESIGN.md "calendar
 * grid"): 7 columns, gap 5, square cells with radius 10, and a legend below.
 */
export function AttendanceCalendar({ month, housekeeperFirstName }: AttendanceCalendarProps) {
  const weeks = calendarWeeks(month);
  return (
    <Card style={styles.card} testID="help-calendar">
      <View style={styles.header}>
        <AppText size={15} weight={800} accessibilityRole="header">
          {month.name}
        </AppText>
        <AppText size={12} color={color.muted} align="right" style={styles.headerNote}>
          {copy.checksIn(housekeeperFirstName)}
        </AppText>
      </View>
      <View style={styles.grid}>
        <View style={styles.week} importantForAccessibility="no-hide-descendants">
          {copy.weekdays.map((letter, i) => (
            <AppText
              // The letters repeat (S, T), so the column index keeps keys unique.
              key={i}
              size={10}
              weight={700}
              color={color.muted}
              align="center"
              style={styles.flex}
            >
              {letter}
            </AppText>
          ))}
        </View>
        {weeks.map((week, w) => (
          <View key={w} style={styles.week}>
            {week.map((cell, i) => {
              if (cell === null) return <View key={`empty-${i}`} style={styles.flex} />;
              const look = CELL[cell.status];
              const mark = copy.mark[cell.status];
              return (
                <View
                  key={cell.day}
                  accessible
                  accessibilityRole="image"
                  accessibilityLabel={copy.dayLabel(cell.day, month.name, copy.status[cell.status])}
                  style={[
                    styles.cell,
                    {
                      backgroundColor: look.background,
                      borderColor: look.dashed ? color.borderStrong : 'transparent',
                      borderStyle: look.dashed ? 'dashed' : 'solid',
                    },
                  ]}
                  testID={`help-day-${cell.day}`}
                >
                  <AppText size={12} weight={700} color={look.text}>
                    {cell.day}
                  </AppText>
                  {mark ? (
                    <AppText size={10} weight={800} color={look.text} lineHeight={10}>
                      {mark}
                    </AppText>
                  ) : null}
                </View>
              );
            })}
          </View>
        ))}
      </View>
      <View style={styles.legend}>
        {copy.legendOrder.map((status) => (
          <View key={status} style={styles.legendItem}>
            <View style={[styles.swatch, { backgroundColor: CELL[status].background }]} />
            <AppText size={11} color={color.muted}>
              {copy.status[status]}
            </AppText>
          </View>
        ))}
      </View>
    </Card>
  );
}

const GAP = 5;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  card: { padding: 14, gap: 10 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 8,
  },
  headerNote: { flexShrink: 1 },
  grid: { gap: GAP },
  week: { flexDirection: 'row', gap: GAP },
  cell: {
    flex: 1,
    minWidth: 0,
    aspectRatio: 1,
    borderRadius: radius.calendarDay,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legend: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 6, columnGap: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  swatch: {
    width: 12,
    height: 12,
    borderRadius: radius.dot,
    borderWidth: 1,
    borderColor: color.border,
  },
});
