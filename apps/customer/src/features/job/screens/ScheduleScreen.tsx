import { AppText, Icon, PrimaryButton, color } from '@kaithozhil/ui';
import { ScrollView, StyleSheet, View } from 'react-native';

import { PageLayout } from '@/components/PageLayout';
import { DayChip, SlotButton } from '../components/ScheduleChoices';
import { scheduleCopy as copy } from '../copy';
import {
  useScheduleChoice,
  type ScheduleChoiceInitial,
  type ScheduledTime,
} from '../hooks/useScheduleChoice';
import { DAY_PARTS, dayPartOf, type FullSlot } from '../scheduleSlots';

export type ScheduleScreenProps = {
  /** The current time; windows less than 2 hours away are shown as passed. */
  now: Date;
  /** Windows with no worker free. Sample data until the server reports them (Sprint 2). */
  fullSlots: readonly FullSlot[];
  initial?: ScheduleChoiceInitial;
  onBack: () => void;
  onConfirm?: (time: ScheduledTime) => void;
};

/** Customer · Schedule a time (design/source/Schedule.dc.html). */
export function ScheduleScreen({
  now,
  fullSlots,
  initial,
  onBack,
  onConfirm,
}: ScheduleScreenProps) {
  const schedule = useScheduleChoice(now, fullSlots, initial);
  const { chosen } = schedule;

  return (
    <PageLayout
      title={copy.title}
      titleTamil={copy.titleTamil}
      backLabel={copy.back}
      onBack={onBack}
      footer={
        <>
          <View style={styles.summary}>
            <AppText size={13} color={color.muted}>
              {copy.yourTime}
            </AppText>
            <AppText size={13} weight={800} testID="schedule-summary">
              {schedule.summary}
            </AppText>
          </View>
          <PrimaryButton
            label={copy.confirm}
            disabled={chosen === null}
            accessibilityHint={chosen ? undefined : copy.missing}
            onPress={() => (chosen ? onConfirm?.(chosen) : undefined)}
            testID="schedule-confirm"
          />
          {chosen ? null : (
            <AppText size={12} color={color.muted} align="center" testID="schedule-missing">
              {copy.missing}
            </AppText>
          )}
        </>
      }
    >
      <AppText size={14} weight={800} accessibilityRole="header">
        {copy.dayHeading}
        <AppText weight={500} color={color.muted}>
          {copy.dayHeadingTamil}
        </AppText>
      </AppText>
      {/*
        A horizontal ScrollView is the React Native version of the design's
        `overflow-x: auto` row. The padding leaves room for the selected
        chip's border and shadow, which a scroll view would otherwise clip.
      */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.daysScroller}
        contentContainerStyle={styles.days}
        accessibilityLabel={copy.dayGroupLabel}
      >
        {schedule.days.map(({ offset, labels }) => (
          <DayChip
            key={offset}
            labels={labels}
            selected={offset === schedule.dayOffset}
            onPress={() => schedule.pickDay(offset)}
            testID={`schedule-day-${offset}`}
          />
        ))}
      </ScrollView>

      <AppText size={14} weight={800} accessibilityRole="header">
        {copy.timeHeading}
        <AppText weight={500} color={color.muted}>
          {copy.timeHeadingTamil}
        </AppText>
      </AppText>
      {DAY_PARTS.map((part) => (
        <View key={part} style={styles.part}>
          <AppText size={13} weight={700} color={color.muted}>
            {copy.dayParts[part]}
          </AppText>
          <View style={styles.slots}>
            {schedule.slots
              .filter((slot) => dayPartOf(slot.start) === part)
              .map((slot) => (
                <SlotButton
                  key={slot.start}
                  label={copy.slots[slot.start]}
                  availability={slot.availability}
                  selected={slot.start === schedule.start}
                  onPress={() => schedule.pickSlot(slot.start)}
                  testID={`schedule-slot-${slot.start}`}
                />
              ))}
          </View>
        </View>
      ))}

      <View style={styles.note}>
        <Icon name="clock" size={16} color={color.muted} />
        <AppText size={12} color={color.muted} lineHeight={12 * 1.4} style={styles.noteText}>
          {copy.noticeNote}
        </AppText>
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  // CSS `margin: 0 -2px` with `padding: 2px 2px 8px`: the chips line up with
  // the page edge while their borders still have 2pt to draw in.
  daysScroller: {
    marginHorizontal: -2,
    flexGrow: 0,
  },
  days: {
    gap: 8,
    paddingTop: 2,
    paddingHorizontal: 2,
    paddingBottom: 8,
  },
  part: { gap: 8 },
  slots: {
    flexDirection: 'row',
    gap: 8,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  noteText: { flex: 1 },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
