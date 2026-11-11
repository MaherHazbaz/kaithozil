import { StyleSheet, View } from 'react-native';

import { color } from '../tokens';
import { AppText } from './AppText';
import { Tappable } from './Tappable';

export type AvatarProps = {
  /** One or two letters, e.g. "MK". */
  initials: string;
  /** Diameter. Default 44. */
  size?: number;
  /** "mango": mango tint circle. "onHero": translucent white circle for purple headers. */
  tone?: 'mango' | 'onHero';
  /** Makes the avatar a button. Requires `accessibilityLabel`. */
  onPress?: () => void;
  accessibilityLabel?: string;
  testID?: string;
};

/** Circle with initials. */
export function Avatar({
  initials,
  size = 44,
  tone = 'mango',
  onPress,
  accessibilityLabel,
  testID,
}: AvatarProps) {
  const circle = [
    styles.circle,
    { width: size, height: size, borderRadius: size / 2 },
    tone === 'mango' ? styles.mango : styles.onHero,
  ];
  const label = (
    <AppText size={14} weight={800} color={tone === 'mango' ? color.mangoText : color.white}>
      {initials}
    </AppText>
  );

  if (onPress) {
    return (
      <Tappable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        // 40pt avatars sit below the 44pt minimum touch target; hitSlop extends
        // the touchable area without changing the drawn size.
        hitSlop={Math.max(0, (44 - size) / 2)}
        testID={testID}
        style={circle}
      >
        {label}
      </Tappable>
    );
  }
  return (
    <View style={circle} testID={testID}>
      {label}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mango: {
    backgroundColor: color.mangoTint,
  },
  onHero: {
    backgroundColor: color.onHeroFill,
    borderWidth: 1,
    borderColor: color.onHeroBorder,
  },
});
