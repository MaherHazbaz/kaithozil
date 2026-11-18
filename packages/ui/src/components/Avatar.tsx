import { StyleSheet, View } from 'react-native';

import { color, shadow } from '../tokens';
import { AppText } from './AppText';
import { Gradient } from './Gradient';
import { Tappable } from './Tappable';

export type AvatarProps = {
  /** One or two letters, e.g. "MK". */
  initials: string;
  /** Diameter. Default 44. */
  size?: number;
  /**
   * "mango": mango tint circle. "onHero": translucent white circle for purple
   * headers. "primary": the purple button gradient with its shadow (Profile).
   * "lavender": lavender circle, purple initials (Safety emergency contacts).
   */
  tone?: 'mango' | 'onHero' | 'primary' | 'lavender';
  /** Initials size. Default 14; Profile's 52pt avatar uses 17. */
  fontSize?: number;
  /** Makes the avatar a button. Requires `accessibilityLabel`. */
  onPress?: () => void;
  accessibilityLabel?: string;
  testID?: string;
};

const LABEL_COLOR = {
  mango: color.mangoText,
  onHero: color.white,
  primary: color.white,
  lavender: color.purple,
} as const;

/** Circle with initials. */
export function Avatar({
  initials,
  size = 44,
  tone = 'mango',
  fontSize = 14,
  onPress,
  accessibilityLabel,
  testID,
}: AvatarProps) {
  const round = { width: size, height: size, borderRadius: size / 2 };
  const label = (
    <AppText size={fontSize} weight={800} color={LABEL_COLOR[tone]}>
      {initials}
    </AppText>
  );
  // The shadow sits on the outer view; the gradient inside is clipped to the circle.
  const circle =
    tone === 'primary'
      ? [styles.circle, round, { boxShadow: shadow.button }]
      : [styles.circle, round, styles[tone]];
  const content =
    tone === 'primary' ? (
      <Gradient name="button" style={[styles.fill, round]}>
        {label}
      </Gradient>
    ) : (
      label
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
        {content}
      </Tappable>
    );
  }
  return (
    <View style={circle} testID={testID}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fill: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  mango: {
    backgroundColor: color.mangoTint,
  },
  lavender: {
    backgroundColor: color.lavender,
  },
  onHero: {
    backgroundColor: color.onHeroFill,
    borderWidth: 1,
    borderColor: color.onHeroBorder,
  },
});
