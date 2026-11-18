import { AppText, Card, Chip, Tappable, color, radius, spacing } from '@kaithozhil/ui';
import { StyleSheet, View } from 'react-native';

import { payCopy as copy } from '../copy';
import { RATINGS, type FeedbackTag, type Rating } from '../jobFeedback';

export type RatingCardProps = {
  rating: Rating;
  tags: readonly FeedbackTag[];
  onRate: (rating: Rating) => void;
  onToggleTag: (tag: FeedbackTag) => void;
};

/** "How was the work?": five stars and feedback chips (Pay.dc.html). */
export function RatingCard({ rating, tags, onRate, onToggleTag }: RatingCardProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.heading}>
        <AppText size={15} weight={700} accessibilityRole="header">
          {copy.ratingHeading}
        </AppText>
        <AppText size={13} weight={700} color={color.star} testID="pay-rating-word">
          {copy.ratingWords[rating]}
        </AppText>
      </View>
      <View style={styles.stars} accessibilityLabel={copy.ratingGroupLabel}>
        {RATINGS.map((stars) => {
          // Every star up to the chosen one is filled in.
          const lit = stars <= rating;
          return (
            <Tappable
              key={stars}
              onPress={() => onRate(stars)}
              accessibilityRole="button"
              accessibilityLabel={copy.starLabel(stars)}
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
        {copy.feedbackTags.map((tag) => (
          <Chip
            key={tag.key}
            label={tag.label}
            compact
            selected={tags.includes(tag.key)}
            onPress={() => onToggleTag(tag.key)}
            testID={`pay-tag-${tag.key}`}
          />
        ))}
      </View>
    </Card>
  );
}

const STAR = 48;

const styles = StyleSheet.create({
  card: {
    padding: 16,
    gap: 12,
    flexShrink: 0,
  },
  heading: {
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
