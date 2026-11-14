import { formatRupees } from '@kaithozhil/core';
import {
  AppText,
  Card,
  Chip,
  Icon,
  PrimaryButton,
  ScreenBackground,
  Tappable,
  color,
  radius,
  spacing,
} from '@kaithozhil/ui';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { payCopy } from '../copy';
import { useJobFeedback } from '../hooks/useJobFeedback';
import { RATINGS, type JobFeedback } from '../jobFeedback';

export type PayScreenProps = {
  worker: { name: string; firstName: string };
  /** e.g. "Fan repair + new regulator". */
  workDone: string;
  /** e.g. "KT-20481". */
  jobId: string;
  /** Whole rupees. */
  amountRupees: number;
  /**
   * Starting rating and chips. Unrated by default; tests pass the design's
   * sample state (4 stars).
   */
  initialFeedback?: Partial<JobFeedback>;
  /** Opens the customer's UPI app. Unset until payments are built. */
  onPay?: (feedback: JobFeedback) => void;
};

/** Pay and rate (design/source/Pay.dc.html). */
export function PayScreen({
  worker,
  workDone,
  jobId,
  amountRupees,
  initialFeedback,
  onPay,
}: PayScreenProps) {
  const insets = useSafeAreaInsets();
  const { rating, tags, setRating, toggleTag } = useJobFeedback(initialFeedback);
  const amount = formatRupees(amountRupees);

  return (
    <ScreenBackground>
      <StatusBar style="dark" />

      <View style={[styles.header, { paddingTop: 48 + insets.top }]}>
        <View style={styles.doneDisc}>
          <Icon name="check" size={36} color={color.purple} strokeWidth={2.4} />
        </View>
        <AppText size={22} weight={800} accessibilityRole="header">
          {payCopy.title}
        </AppText>
        <AppText size={14} color={color.muted} align="center">
          {payCopy.subtitle(worker.firstName)}
        </AppText>
      </View>

      <ScrollView
        style={styles.flex}
        // The design has no bottom padding because everything fits its frame.
        // On a shorter screen this leaves room for the last card's shadow.
        contentContainerStyle={[styles.body, { paddingBottom: 20 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.summary}>
          <SummaryRow label={payCopy.workDone} value={workDone} />
          <SummaryRow label={payCopy.worker} value={worker.name} />
          <SummaryRow label={payCopy.jobId} value={jobId} />
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <AppText size={15} weight={700}>
              {payCopy.total}
            </AppText>
            <AppText size={30} weight={800}>
              {amount}
            </AppText>
          </View>
        </Card>

        <View style={styles.pay}>
          <PrimaryButton
            label={payCopy.payCta(amount)}
            icon="wallet"
            height={58}
            fontSize={17}
            fontWeight={800}
            onPress={() => onPay?.({ rating, tags })}
            testID="pay-upi"
          />
          <AppText size={12} color={color.muted} align="center">
            {payCopy.payNote(worker.firstName)}
          </AppText>
        </View>

        <Card style={styles.rating}>
          <View style={styles.ratingHeading}>
            <AppText size={15} weight={700}>
              {payCopy.ratingHeading}
            </AppText>
            <AppText size={13} weight={700} color={color.star} testID="pay-rating-word">
              {payCopy.ratingWords[rating]}
            </AppText>
          </View>
          <View style={styles.stars} accessibilityLabel={payCopy.ratingGroupLabel}>
            {RATINGS.map((stars) => {
              // Every star up to the chosen one is filled in.
              const lit = stars <= rating;
              return (
                <Tappable
                  key={stars}
                  onPress={() => setRating(stars)}
                  accessibilityRole="button"
                  accessibilityLabel={payCopy.starLabel(stars)}
                  accessibilityState={{ selected: stars === rating }}
                  style={[styles.star, lit ? styles.starLit : styles.starOff]}
                  testID={`pay-star-${stars}`}
                >
                  <AppText size={24} color={lit ? color.star : color.starOff}>
                    ★
                  </AppText>
                </Tappable>
              );
            })}
          </View>
          <View style={styles.tags}>
            {payCopy.feedbackTags.map((tag) => (
              <Chip
                key={tag.key}
                label={tag.label}
                compact
                selected={tags.includes(tag.key)}
                onPress={() => toggleTag(tag.key)}
                testID={`pay-tag-${tag.key}`}
              />
            ))}
          </View>
        </Card>
      </ScrollView>
    </ScreenBackground>
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

const DONE_DISC = 72;
const STAR = 48;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    paddingHorizontal: spacing.screenPadding,
    alignItems: 'center',
    gap: 12,
  },
  doneDisc: {
    width: DONE_DISC,
    height: DONE_DISC,
    borderRadius: DONE_DISC / 2,
    backgroundColor: color.lavender,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    paddingTop: 24,
    paddingHorizontal: spacing.screenPadding,
    gap: 16,
  },
  summary: {
    padding: 16,
    gap: spacing.gapM,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  summaryValue: { flexShrink: 1 },
  divider: {
    height: 1,
    backgroundColor: color.border,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // Lines up the small "Total" with the bottom of the large amount.
    alignItems: 'baseline',
  },
  pay: { gap: 8 },
  rating: {
    padding: 16,
    gap: 12,
  },
  ratingHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  stars: {
    flexDirection: 'row',
    gap: spacing.gapS,
  },
  star: {
    width: STAR,
    height: STAR,
    borderRadius: radius.ratingStar,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starLit: {
    borderColor: color.starBorder,
    backgroundColor: color.starTint,
  },
  starOff: {
    borderColor: color.borderStrong,
    backgroundColor: color.white,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.gapS,
  },
});
