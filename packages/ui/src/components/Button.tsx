import { StyleSheet, View } from 'react-native';

import { color, radius, shadow, size, type as typeStyle } from '../tokens';
import { AppText } from './AppText';
import { Gradient } from './Gradient';
import { Icon, type IconName } from './Icon';
import { Tappable } from './Tappable';

type CommonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  /** Read by screen readers instead of `label` when given. */
  accessibilityLabel?: string;
  /** Read by screen readers after the label, e.g. why the button is disabled. */
  accessibilityHint?: string;
  testID?: string;
};

export type GradientButtonProps = CommonProps & {
  /** Default 56 (DESIGN.md: 48-72 by context). */
  height?: number;
  /** Default: the 16pt button radius. Use "smallButton" for compact buttons. */
  radius?: 'button' | 'smallButton';
  /** Default 16. */
  fontSize?: number;
  /** Horizontal padding for buttons sized by their label (e.g. "Book"). */
  paddingHorizontal?: number;
};

type Variant = 'primary' | 'gold';

const VARIANT = {
  primary: { gradient: 'button', shadow: 'button', text: color.white },
  gold: { gradient: 'goldButton', shadow: 'goldButton', text: color.mangoInk },
} as const;

function GradientButton({
  variant,
  label,
  onPress,
  disabled,
  accessibilityLabel,
  accessibilityHint,
  testID,
  height = size.primaryButtonHeight,
  radius: radiusName = 'button',
  fontSize = typeStyle.button.size,
  paddingHorizontal = 0,
}: GradientButtonProps & { variant: Variant }) {
  const v = VARIANT[variant];
  const corner = radius[radiusName];
  return (
    <Tappable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: Boolean(disabled) }}
      testID={testID}
      // Shadow on the outer view, gradient clipped to the corners inside it.
      style={[
        { height, borderRadius: corner, boxShadow: shadow[v.shadow] },
        disabled ? styles.disabled : null,
      ]}
    >
      <Gradient
        name={v.gradient}
        style={[styles.fill, { borderRadius: corner, paddingHorizontal }]}
      >
        <AppText size={fontSize} weight={typeStyle.button.weight} color={v.text} numberOfLines={1}>
          {label}
        </AppText>
      </Gradient>
    </Tappable>
  );
}

/** Main call to action: purple gradient, white label. */
export function PrimaryButton(props: GradientButtonProps) {
  return <GradientButton variant="primary" {...props} />;
}

/** "Accept" on worker alerts: gold gradient, dark label. */
export function GoldButton(props: GradientButtonProps) {
  return <GradientButton variant="gold" {...props} />;
}

export type SecondaryButtonProps = CommonProps & {
  /** Optional 18pt icon before the label ("Add photo", "Voice note"). */
  icon?: IconName;
  /** Default 48. The card buttons on Bookings are 44. */
  height?: number;
  /** Label colour. "purple" (default) or "ink" ("Get help" on Bookings). */
  tone?: 'purple' | 'ink';
};

/** White outlined button, purple label by default (height 48, radius 14). */
export function SecondaryButton({
  label,
  onPress,
  disabled,
  accessibilityLabel,
  testID,
  icon,
  height = size.secondaryButtonHeight,
  tone = 'purple',
}: SecondaryButtonProps) {
  const tint = tone === 'purple' ? color.purple : color.ink;
  return (
    <Tappable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: Boolean(disabled) }}
      testID={testID}
      style={[styles.secondary, { height }]}
    >
      {icon ? <Icon name={icon} size={18} color={tint} /> : null}
      <AppText size={14} weight={700} color={tint} numberOfLines={1}>
        {label}
      </AppText>
    </Tappable>
  );
}

export type GoldIconButtonProps = {
  icon: IconName;
  onPress?: () => void;
  /** Required: an icon-only button has no visible text for screen readers. */
  accessibilityLabel: string;
  testID?: string;
};

/** Square gold icon button (the 52pt voice button on Home). */
export function GoldIconButton({ icon, onPress, accessibilityLabel, testID }: GoldIconButtonProps) {
  return (
    <Tappable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      style={styles.iconButton}
    >
      <Gradient name="goldButton" style={[styles.fill, styles.iconButtonFill]}>
        <View>
          <Icon name={icon} size={22} color={color.purpleDeep} />
        </View>
      </Gradient>
    </Tappable>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    overflow: 'hidden',
  },
  // NOT in the design, which shows no disabled buttons. Half opacity is the
  // least intrusive way to show "not yet"; screen readers get the disabled
  // state separately through accessibilityState.
  disabled: {
    opacity: 0.5,
  },
  secondary: {
    borderRadius: radius.smallButton,
    borderWidth: 1,
    borderColor: color.borderStrong,
    backgroundColor: color.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  iconButton: {
    width: 52,
    height: 52,
    borderRadius: radius.searchField,
    boxShadow: shadow.goldButton,
  },
  iconButtonFill: {
    borderRadius: radius.searchField,
  },
});
