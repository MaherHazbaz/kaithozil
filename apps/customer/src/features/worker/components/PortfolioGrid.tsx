import { AppText, Gradient, Icon, color, radius, type GradientName } from '@kaithozhil/ui';
import { StyleSheet, View } from 'react-native';

import { publicProfileCopy as copy } from '../copy';
import type { PortfolioItem } from '../types';

const COLUMNS = 3;

// The design's stand-in tints, repeated by position (tile 5 = tile 1).
const TILE_TINTS: readonly GradientName[] = [
  'photoPlaceholder1',
  'photoPlaceholder2',
  'photoPlaceholder3',
  'photoPlaceholder4',
];

/**
 * The Work tab: a three-column grid of square photo tiles.
 *
 * React Native has no CSS grid, so the items are split into rows of three and
 * each tile takes an equal share of its row (flex: 1). A short last row is
 * padded with empty cells so its tiles keep the same width, as CSS grid does.
 */
export function PortfolioGrid({ items }: { items: readonly PortfolioItem[] }) {
  const rows: PortfolioItem[][] = [];
  for (let start = 0; start < items.length; start += COLUMNS) {
    rows.push(items.slice(start, start + COLUMNS));
  }
  return (
    <View style={styles.grid}>
      {rows.map((row, rowIndex) => (
        <View key={row[0]?.id ?? rowIndex} style={styles.row}>
          {row.map((item, column) => (
            <PortfolioTile
              key={item.id}
              item={item}
              tint={TILE_TINTS[(rowIndex * COLUMNS + column) % TILE_TINTS.length]}
            />
          ))}
          {Array.from({ length: COLUMNS - row.length }, (_, index) => (
            <View key={`empty-${index}`} style={styles.cell} />
          ))}
        </View>
      ))}
    </View>
  );
}

function PortfolioTile({ item, tint }: { item: PortfolioItem; tint: GradientName | undefined }) {
  return (
    <Gradient
      name={tint ?? 'photoPlaceholder1'}
      style={[styles.cell, styles.tile]}
      // One image for screen readers, named like the design's aria-label.
      accessible
      accessibilityRole="image"
      accessibilityLabel={copy.photoLabel(item.caption, item.date)}
      testID={`profile-work-${item.id}`}
    >
      <Icon name={item.icon} size={30} color={color.purple} strokeWidth={1.8} />
      <View style={styles.badge}>
        <Icon name="badgeCheck" size={11} color={color.gold} />
        <AppText size={9.5} weight={800} color={color.gold}>
          {copy.jobBadge}
        </AppText>
      </View>
      <Gradient name="photoCaption" style={styles.caption}>
        <AppText size={10.5} weight={700} color={color.white} lineHeight={10.5 * 1.2}>
          {item.caption}
        </AppText>
      </Gradient>
    </Gradient>
  );
}

const styles = StyleSheet.create({
  grid: { gap: 8 },
  row: { flexDirection: 'row', gap: 8 },
  cell: { flex: 1, minWidth: 0, aspectRatio: 1 },
  tile: {
    // 14 in the design; radius.note is the 14pt token.
    borderRadius: radius.note,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 6,
    left: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: color.photoBadge,
    borderRadius: radius.pill,
    paddingVertical: 3,
    paddingHorizontal: 7,
  },
  caption: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 14,
    paddingHorizontal: 7,
    paddingBottom: 6,
  },
});
