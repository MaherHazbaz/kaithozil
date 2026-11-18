import { AppText, Card, Chip, PrimaryButton, Stepper, color, radius } from '@kaithozhil/ui';
import { StyleSheet, View } from 'react-native';

import { PageLayout } from '@/components/PageLayout';

import { ChoiceCard, SectionHeading, TextLink, ToggleRow } from '../components/Parts';
import { DayPicker } from '../components/Pickers';
import { bookCopy as copy } from '../copy';
import { MAX_HOURS, MIN_HOURS } from '../housekeepingDraft';
import { useHousekeepingDraft, type HousekeepingDraftInitial } from '../hooks/useHousekeepingDraft';
import type { HousekeepingDraft } from '../types';

export type HousekeepingBookScreenProps = {
  /** Starting values. The design's first state by default; tests pass others. */
  initialDraft?: HousekeepingDraftInitial;
  onBack: () => void;
  /** "Already have regular help? Manage it". */
  onManage?: () => void;
  /** "Find housekeepers" / "Book a cleaning", with the complete request. */
  onSubmit?: (request: HousekeepingDraft) => void;
};

/** Customer · Housekeeping (design/source/HousekeepingBook.dc.html). */
export function HousekeepingBookScreen({
  initialDraft,
  onBack,
  onManage,
  onSubmit,
}: HousekeepingBookScreenProps) {
  const draft = useHousekeepingDraft(initialDraft);
  const { type, tasks, size, days, slot, hours, preferWoman, trialDay, missing, request } = draft;
  const regular = type === 'regular';

  const footer = (
    <>
      <PrimaryButton
        label={regular ? copy.ctaRegular : copy.ctaOneTime}
        disabled={request === null}
        // Read after the button's name, so screen-reader users hear why it is disabled.
        accessibilityHint={missing ? copy.missing[missing] : undefined}
        onPress={() => request && onSubmit?.(request)}
        testID="housekeeping-submit"
      />
      {/* A disabled button with no reason looks broken: say what is missing. */}
      {missing ? (
        <AppText size={12} color={color.muted} align="center" testID="housekeeping-missing">
          {copy.missing[missing]}
        </AppText>
      ) : null}
    </>
  );

  return (
    <PageLayout
      title={copy.title}
      titleTamil={copy.titleTamil}
      backLabel={copy.back}
      onBack={onBack}
      footer={footer}
    >
      <View
        style={styles.section}
        accessibilityRole="radiogroup"
        accessibilityLabel={copy.typeGroup}
      >
        {copy.types.map((option) => (
          <ChoiceCard
            key={option.key}
            icon={option.icon}
            title={option.title}
            titleTamil={option.titleTamil}
            detail={option.detail}
            selected={type === option.key}
            onPress={() => draft.setType(option.key)}
            testID={`housekeeping-type-${option.key}`}
          />
        ))}
      </View>

      <View style={styles.section}>
        <SectionHeading text={copy.tasksHeading} tamil={copy.tasksHeadingTamil} />
        <View style={styles.chips} accessibilityLabel={copy.tasksGroup}>
          {copy.tasks.map((option) => (
            <Chip
              key={option.key}
              label={option.label}
              selected={tasks.includes(option.key)}
              onPress={() => draft.toggleTask(option.key)}
              testID={`housekeeping-task-${option.key}`}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeading text={copy.sizeHeading} tamil={copy.sizeHeadingTamil} />
        <View style={styles.chips} accessibilityLabel={copy.sizeGroup}>
          {copy.sizes.map((option) => (
            <Chip
              key={option.key}
              label={option.label}
              selected={size === option.key}
              onPress={() => draft.setSize(option.key)}
              testID={`housekeeping-size-${option.key}`}
            />
          ))}
        </View>
      </View>

      {regular ? (
        <View style={styles.section}>
          <View style={styles.daysHeader}>
            <SectionHeading text={copy.daysHeading} tamil={copy.daysHeadingTamil} />
            <AppText size={12} color={color.muted} testID="housekeeping-day-count">
              {copy.dayCount(days.length)}
            </AppText>
          </View>
          <DayPicker
            days={copy.days}
            selected={days}
            onToggle={draft.toggleDay}
            accessibilityLabel={copy.daysGroup}
          />
        </View>
      ) : null}

      <View style={styles.section}>
        <SectionHeading text={copy.timeHeading} tamil={copy.timeHeadingTamil} />
        <View style={styles.chips} accessibilityLabel={copy.timeGroup}>
          {copy.slots.map((option) => (
            <Chip
              key={option.key}
              label={option.label}
              selected={slot === option.key}
              onPress={() => draft.setSlot(option.key)}
              testID={`housekeeping-slot-${option.key}`}
            />
          ))}
        </View>
      </View>

      <View style={styles.hours}>
        <View style={styles.hoursText}>
          <AppText size={14} weight={700}>
            {copy.hoursTitle}
          </AppText>
          <AppText size={12} color={color.muted}>
            {copy.hoursTitleTamil}
          </AppText>
        </View>
        <Stepper
          value={hours}
          onChange={draft.setHours}
          min={MIN_HOURS}
          max={MAX_HOURS}
          decreaseLabel={copy.fewerHours}
          increaseLabel={copy.moreHours}
          valueSize={20}
          valueWidth={30}
        />
      </View>

      <ToggleRow
        title={copy.womanTitle}
        detail={copy.womanDetail}
        on={preferWoman}
        onPress={draft.togglePreferWoman}
        testID="housekeeping-woman"
      />

      {regular ? (
        <ToggleRow
          title={copy.trialTitle}
          detail={copy.trialDetail}
          on={trialDay}
          onPress={draft.toggleTrialDay}
          testID="housekeeping-trial"
        />
      ) : null}

      <Card style={styles.estimate}>
        <View style={styles.estimateRow}>
          <AppText size={14} weight={800}>
            {copy.estimate}
          </AppText>
          <AppText size={18} weight={800} color={color.purple} testID="housekeeping-estimate">
            {draft.estimate.amount}
          </AppText>
        </View>
        <AppText
          size={12}
          color={color.muted}
          lineHeight={12 * 1.4}
          testID="housekeeping-estimate-detail"
        >
          {draft.estimate.detail}
        </AppText>
      </Card>

      <TextLink label={copy.manage} onPress={onManage} testID="housekeeping-manage" />
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  section: { gap: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  daysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  hours: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: radius.chipSquare,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  // The Tamil line is long; it wraps instead of pushing the stepper off screen.
  hoursText: { flexShrink: 1 },
  estimate: { padding: 14, gap: 4 },
  estimateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 12,
  },
});
