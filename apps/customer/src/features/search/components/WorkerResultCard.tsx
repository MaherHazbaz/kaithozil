import {
  AppText,
  Avatar,
  Card,
  Gradient,
  Icon,
  color,
  radius,
  type GradientName,
} from '@kaithozhil/ui';
import { StyleSheet, View } from 'react-native';

import { searchCopy as copy } from '../copy';
import type { WorkSample, WorkerResult } from '../types';

export type WorkerResultCardProps = {
  worker: WorkerResult;
  onPress?: () => void;
};

/** One worker in the results list (Search.dc.html result card). */
export function WorkerResultCard({ worker, onPress }: WorkerResultCardProps) {
  const isNew = worker.level === null;
  const tradeLine = copy.tradeLine(worker.trade, worker.level);
  return (
    <Card
      onPress={onPress}
      accessibilityLabel={copy.workerLabel(
        worker.name,
        tradeLine,
        worker.rating,
        worker.jobsDone,
        worker.distanceKm,
      )}
      style={styles.card}
      testID={`search-worker-${worker.id}`}
    >
      <View style={styles.top}>
        <Avatar
          initials={worker.initials}
          size={48}
          fontSize={15}
          tone={isNew ? 'lavender' : 'mango'}
        />
        <View style={styles.text}>
          <View style={styles.nameRow}>
            <AppText size={16} weight={800} numberOfLines={1} style={styles.shrink}>
              {worker.name}
            </AppText>
            {isNew ? (
              <View style={styles.newBadge}>
                <AppText size={11} weight={800} color={color.mangoText}>
                  {copy.newBadge}
                </AppText>
              </View>
            ) : (
              <Icon name="badgeCheck" size={18} color={color.purple} strokeWidth={2.2} />
            )}
          </View>
          <AppText size={12} color={color.muted}>
            {tradeLine}
          </AppText>
          <AppText size={12}>
            <AppText weight={700} color={color.star}>
              {copy.rating(worker.rating)}
            </AppText>
            {copy.statsAfterRating(worker.jobsDone, worker.distanceKm)}
          </AppText>
        </View>
      </View>
      <WorkStrip work={worker.work} />
      {isNew ? (
        <View style={styles.newNote}>
          <AppText size={11} color={color.mangoText}>
            {copy.newNote}
          </AppText>
        </View>
      ) : null}
    </Card>
  );
}

// The design repeats these three tints by position. The third (#C9BCEB → #EFE9FB)
// has no token yet, so the nearest one stands in (see the screen report).
const TILE_GRADIENTS: readonly GradientName[] = [
  'photoPlaceholder1',
  'photoPlaceholder2',
  'photoPlaceholder1',
];
const COLUMNS = 3;

/** A three-column grid of square tiles; a short list leaves the last cells empty, as CSS grid does. */
function WorkStrip({ work }: { work: readonly WorkSample[] }) {
  const empty = Math.max(0, COLUMNS - work.length);
  return (
    <View style={styles.strip}>
      {work.slice(0, COLUMNS).map((sample, index) => (
        <Gradient
          key={sample.label}
          name={TILE_GRADIENTS[index] ?? 'photoPlaceholder1'}
          style={styles.tile}
          accessible
          accessibilityRole="image"
          accessibilityLabel={sample.label}
        >
          <Icon name={sample.icon} size={20} color={color.purple} strokeWidth={1.8} />
          <AppText size={9.5} weight={700} align="center" lineHeight={9.5 * 1.1}>
            {sample.label}
          </AppText>
        </Gradient>
      ))}
      {Array.from({ length: empty }, (_, index) => (
        <View key={`empty-${index}`} style={styles.cell} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 14, gap: 10 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  text: { flex: 1, minWidth: 0, gap: 2 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  shrink: { flexShrink: 1 },
  newBadge: {
    flexShrink: 0,
    backgroundColor: color.mangoTint,
    borderRadius: radius.statusPill,
    paddingVertical: 3,
    paddingHorizontal: 7,
  },
  strip: { flexDirection: 'row', gap: 6 },
  // flex: 1 with equal basis gives three equal columns, like
  // `repeat(3, minmax(0, 1fr))`; aspectRatio makes each one square.
  cell: { flex: 1, aspectRatio: 1 },
  tile: {
    flex: 1,
    aspectRatio: 1,
    // 10 in the design; radius.segment is the only 10pt radius token.
    borderRadius: radius.segment,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    padding: 4,
  },
  newNote: {
    backgroundColor: color.mangoTint,
    borderRadius: radius.statusPill,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
});
