import { AppText, Avatar, Card, color } from '@kaithozhil/ui';
import { StyleSheet, View } from 'react-native';

import { publicProfileCopy as copy } from '../copy';
import type { WorkerReview } from '../types';

/** One customer review on the Reviews tab (WorkerProfile.dc.html). */
export function ReviewCard({ review }: { review: WorkerReview }) {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Avatar initials={review.initials} size={36} fontSize={11} tone="lavender" />
        <View style={styles.who}>
          <AppText size={14} weight={700}>
            {review.name}
          </AppText>
          <AppText size={11} color={color.muted}>
            {copy.reviewMeta(review.job, review.date)}
          </AppText>
        </View>
        <AppText
          size={13}
          weight={800}
          color={color.star}
          accessibilityLabel={copy.starsLabel(review.stars)}
        >
          {copy.stars(review.stars)}
        </AppText>
      </View>
      <AppText size={13} lineHeight={13 * 1.45}>
        {review.text}
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { padding: 14, gap: 10 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  who: { flexGrow: 1, flexShrink: 1 },
});
