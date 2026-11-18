import { Gradient, Icon, color, radius, type GradientName } from '@kaithozhil/ui';
import { StyleSheet, View } from 'react-native';

const COLUMNS = 3;
const GAP = 8;

/** The design's tile fills, in order: lavender, mango, deep lavender. */
const FILLS: readonly GradientName[] = [
  'photoPlaceholder1',
  'photoPlaceholder2',
  'photoPlaceholder3',
];

export type PhotoPlaceholderGridProps = {
  /** One screen-reader name per photo ("Finished work photo 1"). */
  labels: readonly string[];
  /** Image icon size: 24 on BillApprove.dc.html, 22 on Handover.dc.html. */
  iconSize: number;
};

/**
 * Photos still to be loaded, in the design's 3-column grid (gap 8, square
 * tiles, radius 12). Real photos replace the gradients once uploads exist
 * (Supabase Storage, Sprint 2).
 *
 * WHY empty spacers: CSS grid keeps a column a third wide even when a row has
 * only two photos. With flexbox two `flex: 1` tiles would stretch to halves,
 * so the last row is padded with invisible cells.
 */
export function PhotoPlaceholderGrid({ labels, iconSize }: PhotoPlaceholderGridProps) {
  const rows: (string | null)[][] = [];
  for (let start = 0; start < labels.length; start += COLUMNS) {
    const row: (string | null)[] = labels.slice(start, start + COLUMNS);
    while (row.length < COLUMNS) row.push(null);
    rows.push(row);
  }
  return (
    <View style={styles.grid}>
      {rows.map((row, rowIndex) => (
        // Rows never reorder, so the position is a safe key.
        <View key={rowIndex} style={styles.row}>
          {row.map((label, column) => {
            const index = rowIndex * COLUMNS + column;
            if (label === null) return <View key={index} style={styles.cell} />;
            return (
              <Gradient
                key={index}
                name={FILLS[index % FILLS.length] ?? 'photoPlaceholder1'}
                accessible
                accessibilityRole="image"
                accessibilityLabel={label}
                style={[styles.cell, styles.tile]}
              >
                <Icon name="image" size={iconSize} color={color.purple} />
              </Gradient>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { gap: GAP },
  row: { flexDirection: 'row', gap: GAP },
  cell: { flex: 1, aspectRatio: 1 },
  tile: {
    borderRadius: radius.codeDigit,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
