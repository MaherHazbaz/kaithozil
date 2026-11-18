import { AppText, Gradient, Icon, Tappable, color, radius } from '@kaithozhil/ui';
import { Image, StyleSheet, View } from 'react-native';

import { mediaCopy as copy } from '../copy';
import type { JobPhoto } from '../jobMedia';

export type PhotoTileProps = {
  /** The photo in this tile, or null for the dashed "Add" tile. */
  photo: JobPhoto | null;
  /** 1-based position, for the spoken labels ("Photo 2", "Remove photo 2"). */
  position: number;
  onRemove?: () => void;
  onAdd?: () => void;
  testID?: string;
};

/** One square of the photo grid on Media.dc.html. */
export function PhotoTile({ photo, position, onRemove, onAdd, testID }: PhotoTileProps) {
  if (!photo) {
    return (
      <Tappable
        onPress={onAdd}
        accessibilityRole="button"
        accessibilityLabel={copy.addTile}
        style={[styles.tile, styles.add]}
        testID={testID}
      >
        <Icon name="plusLines" size={22} color={color.muted} />
        <AppText size={12} weight={700} color={color.muted}>
          {copy.addTile}
        </AppText>
      </Tappable>
    );
  }

  return (
    <View style={styles.tile} testID={testID}>
      {photo.uri ? (
        <Image
          source={{ uri: photo.uri }}
          style={styles.fill}
          accessibilityLabel={copy.photoLabel(position)}
          accessibilityRole="image"
        />
      ) : (
        // No file yet (sample data): the design's lavender placeholder.
        <Gradient
          name="photoPlaceholder1"
          style={[styles.fill, styles.placeholder]}
          accessible
          accessibilityRole="image"
          accessibilityLabel={copy.photoLabel(position)}
        >
          <Icon name="image" size={28} color={color.purple} />
        </Gradient>
      )}
      <Tappable
        onPress={onRemove}
        accessibilityRole="button"
        accessibilityLabel={copy.removePhoto(position)}
        // Drawn at 30pt; hitSlop grows the touch area to 44pt without changing the look.
        hitSlop={7}
        style={styles.remove}
        testID={testID ? `${testID}-remove` : undefined}
      >
        <Icon name="x" size={14} color={color.white} strokeWidth={3} />
      </Tappable>
    </View>
  );
}

const TILE_RADIUS = radius.tileIcon;
const REMOVE_SIZE = 30;

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    // CSS aspect-ratio: 1 / 1. The width comes from the 3-column row.
    aspectRatio: 1,
    borderRadius: TILE_RADIUS,
  },
  fill: {
    // CSS `position: absolute; inset: 0`.
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: TILE_RADIUS,
    overflow: 'hidden',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  add: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: color.borderStrong,
    backgroundColor: color.white,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  remove: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: REMOVE_SIZE,
    height: REMOVE_SIZE,
    borderRadius: REMOVE_SIZE / 2,
    borderWidth: 2,
    borderColor: color.white,
    backgroundColor: color.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
