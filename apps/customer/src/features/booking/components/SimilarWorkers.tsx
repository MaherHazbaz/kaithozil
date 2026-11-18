import { AppText, Avatar, Card, Icon, Tappable, color } from '@kaithozhil/ui';
import { StyleSheet, View } from 'react-native';

import { requestSentCopy as copy } from '../copy';
import type { SimilarWorker } from '../types';

export type SimilarWorkersProps = {
  /** e.g. "electricians". */
  tradePlural: string;
  workers: readonly SimilarWorker[];
  onOpenWorker?: (id: string) => void;
};

/** "Similar electricians near you", offered after a decline. Each row opens that worker's profile. */
export function SimilarWorkers({ tradePlural, workers, onOpenWorker }: SimilarWorkersProps) {
  return (
    <Card style={styles.card}>
      <AppText size={13} weight={800} accessibilityRole="header">
        {copy.declined.similar(tradePlural)}
      </AppText>
      {workers.map((worker) => (
        <Tappable
          key={worker.id}
          onPress={() => onOpenWorker?.(worker.id)}
          accessibilityRole="button"
          accessibilityLabel={`${worker.name}, ${worker.detail}, ${copy.declined.rating(worker.rating)}`}
          style={styles.row}
          testID={`similar-${worker.id}`}
        >
          <Avatar initials={worker.initials} size={40} fontSize={13} />
          <View style={styles.text}>
            <AppText size={14} weight={800}>
              {worker.name}
            </AppText>
            <AppText size={12} color={color.muted}>
              {`${worker.detail} · `}
              <AppText weight={700} color={color.star}>
                {copy.declined.rating(worker.rating)}
              </AppText>
            </AppText>
          </View>
          <Icon name="chevronRight" size={18} color={color.muted} />
        </Tappable>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { paddingTop: 10, paddingHorizontal: 14, paddingBottom: 4, gap: 2 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: color.border,
  },
  text: { flexGrow: 1, flexShrink: 1 },
});
