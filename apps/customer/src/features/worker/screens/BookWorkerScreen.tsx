import {
  AppText,
  Avatar,
  Card,
  Icon,
  PrimaryButton,
  ScreenBackground,
  ScreenHeader,
  color,
  radius,
  spacing,
} from '@kaithozhil/ui';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TimeSlotCard } from '../components/TimeSlotCard';
import { bookWorkerCopy } from '../copy';
import type { TimeSlot, WorkerProfile } from '../types';

export type BookWorkerScreenProps = {
  worker: WorkerProfile;
  /** Times the worker can come. The first one starts selected, as in the design. */
  slots: readonly TimeSlot[];
  /** e.g. "Fan not working". */
  problem: string;
  /** e.g. "₹400 – 700". */
  estimateRange: string;
  onBack: () => void;
  /** Booking is not built yet, so the route decides where this leads. */
  onBook?: (slot: TimeSlot) => void;
};

/** Worker profile, book again (design/source/Book.dc.html). */
export function BookWorkerScreen({
  worker,
  slots,
  problem,
  estimateRange,
  onBack,
  onBook,
}: BookWorkerScreenProps) {
  const insets = useSafeAreaInsets();
  const [slotId, setSlotId] = useState(slots[0]?.id);
  const slot = slots.find((candidate) => candidate.id === slotId);

  return (
    <ScreenBackground>
      <StatusBar style="dark" />
      <ScreenHeader
        title={worker.trade}
        backLabel={bookWorkerCopy.back}
        onBack={onBack}
        topInset={insets.top}
        paddingTop={24}
        titleWeight={700}
        testID="worker-back"
      />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        {/* Flat in the design: a border but no shadow, unlike `Card`. */}
        <View style={styles.profile}>
          <View style={styles.identity}>
            <Avatar initials={worker.initials} size={64} fontSize={22} />
            <View style={styles.identityText}>
              <AppText size={20} weight={800}>
                {worker.name}
              </AppText>
              <View style={styles.badge}>
                <Icon name="badgeCheck" size={14} color={color.purple} strokeWidth={2.2} />
                <AppText size={12} weight={700} color={color.purple}>
                  {worker.badge}
                </AppText>
              </View>
            </View>
          </View>

          <View style={styles.stats}>
            <Stat
              value={bookWorkerCopy.ratingValue(worker.rating)}
              label={bookWorkerCopy.rating}
              valueColor={color.star}
            />
            <Stat value={String(worker.jobsDone)} label={bookWorkerCopy.jobsDone} />
            <Stat
              value={bookWorkerCopy.experienceValue(worker.experienceYears)}
              label={bookWorkerCopy.experience}
            />
          </View>

          <View style={styles.tags}>
            {worker.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <AppText size={12} weight={600}>
                  {tag}
                </AppText>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.time}>
          <AppText size={16} weight={700} accessibilityRole="header">
            {bookWorkerCopy.chooseTime}
          </AppText>
          <View style={styles.slots} accessibilityLabel={bookWorkerCopy.timeGroupLabel}>
            {slots.map((candidate) => (
              <TimeSlotCard
                key={candidate.id}
                slot={candidate}
                selected={candidate.id === slotId}
                onPress={() => setSlotId(candidate.id)}
                testID={`worker-slot-${candidate.id}`}
              />
            ))}
          </View>
        </View>

        <Card style={styles.summary}>
          <SummaryRow label={bookWorkerCopy.problem} value={problem} />
          <SummaryRow label={bookWorkerCopy.estimate} value={estimateRange} />
          <AppText size={12} color={color.muted}>
            {bookWorkerCopy.priceNote(worker.firstName)}
          </AppText>
        </Card>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: 28 + insets.bottom }]}>
        {/* With no free slot there is nothing to book, so there is no button. */}
        {slot ? (
          <PrimaryButton
            label={bookWorkerCopy.bookCta(worker.firstName, slot.day, slot.time)}
            onPress={() => onBook?.(slot)}
            testID="worker-book"
          />
        ) : null}
      </View>
    </ScreenBackground>
  );
}

function Stat({ value, label, valueColor }: { value: string; label: string; valueColor?: string }) {
  return (
    // Read as one item by screen readers: "280, Jobs done".
    <View style={styles.stat} accessible accessibilityLabel={`${value}, ${label}`}>
      <AppText size={18} weight={800} color={valueColor}>
        {value}
      </AppText>
      <AppText size={12} color={color.muted}>
        {label}
      </AppText>
    </View>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <AppText size={14} color={color.muted}>
        {label}
      </AppText>
      {/* A long value wraps instead of pushing the label off the card. */}
      <AppText size={14} weight={600} align="right" style={styles.summaryValue}>
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  body: {
    paddingTop: 18,
    paddingHorizontal: spacing.screenPadding,
    // The design has no bottom padding because everything fits its frame.
    // On a shorter screen this leaves room for the last card's shadow.
    paddingBottom: 20,
    gap: 16,
  },
  profile: {
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: radius.card,
    padding: 18,
    gap: 16,
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  identityText: {
    flexShrink: 1,
    gap: 6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: color.lavender,
    borderRadius: radius.pill,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  stats: {
    flexDirection: 'row',
    gap: 8,
  },
  stat: {
    // Three equal columns (the design's grid).
    flex: 1,
    backgroundColor: color.pageBackground,
    borderRadius: radius.statTile,
    padding: 10,
    alignItems: 'center',
    gap: 2,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.gapS,
  },
  tag: {
    borderWidth: 1,
    borderColor: color.borderStrong,
    borderRadius: radius.pill,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  time: { gap: spacing.gapM },
  slots: {
    flexDirection: 'row',
    gap: 8,
  },
  summary: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  summaryValue: { flexShrink: 1 },
  footer: {
    paddingTop: 16,
    paddingHorizontal: spacing.screenPadding,
    backgroundColor: color.white,
    borderTopWidth: 1,
    borderTopColor: color.border,
  },
});
