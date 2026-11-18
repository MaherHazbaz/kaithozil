import { StyleSheet, View } from 'react-native';

import { color, radius, shadow, size } from '../tokens';
import { AppText } from './AppText';
import { Icon, type IconName } from './Icon';
import { Tappable } from './Tappable';

export type BottomNavItem<Key extends string> = {
  key: Key;
  label: string;
  icon: IconName;
};

export type BottomNavProps<Key extends string> = {
  items: readonly BottomNavItem<Key>[];
  activeKey: Key;
  onSelect: (key: Key) => void;
  /** Safe-area bottom inset, added below the design's 16pt margin. */
  bottomInset?: number;
};

/**
 * Floating bottom navigation: height 68, margin 8 14 16 14, radius 24.
 * The active tab sits on a lavender pill (radius 18).
 */
export function BottomNav<Key extends string>({
  items,
  activeKey,
  onSelect,
  bottomInset = 0,
}: BottomNavProps<Key>) {
  return (
    <View accessibilityRole="tablist" style={[styles.bar, { marginBottom: 16 + bottomInset }]}>
      {items.map((item) => {
        const active = item.key === activeKey;
        const tint = active ? color.purple : color.muted;
        return (
          <Tappable
            key={item.key}
            onPress={() => onSelect(item.key)}
            accessibilityRole="tab"
            accessibilityLabel={item.label}
            accessibilityState={{ selected: active }}
            style={[styles.item, active ? styles.itemActive : null]}
          >
            <Icon name={item.icon} size={22} color={tint} />
            <AppText size={12} weight={active ? 700 : 600} color={tint} numberOfLines={1}>
              {item.label}
            </AppText>
          </Tappable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: size.navHeight,
    flexShrink: 0,
    // v3: an 8pt gap above the bar, so the last item of the page never touches it.
    marginTop: 8,
    marginHorizontal: 14,
    padding: 6,
    flexDirection: 'row',
    backgroundColor: color.white,
    borderRadius: radius.nav,
    boxShadow: shadow.nav,
  },
  item: {
    // Equal-width columns, like the design's `repeat(3, minmax(0, 1fr))` grid.
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderRadius: radius.navItem,
  },
  itemActive: {
    backgroundColor: color.lavender,
  },
});
