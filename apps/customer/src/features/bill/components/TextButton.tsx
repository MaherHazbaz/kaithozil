import { AppText, Tappable, color } from '@kaithozhil/ui';
import { StyleSheet } from 'react-native';

export type TextButtonProps = {
  label: string;
  onPress?: () => void;
  /** Default purple. "Something's not right" is ink, "Paying in cash instead?" muted. */
  tone?: 'purple' | 'ink' | 'muted';
  /** Default 14 (BillApprove.dc.html); Pay.dc.html uses 13. */
  size?: 13 | 14;
  disabled?: boolean;
  testID?: string;
};

const TONE = { purple: color.purple, ink: color.ink, muted: color.muted } as const;

/** A borderless button: bold text in a 44pt-high touch area. */
export function TextButton({
  label,
  onPress,
  tone = 'purple',
  size = 14,
  disabled,
  testID,
}: TextButtonProps) {
  return (
    <Tappable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: Boolean(disabled) }}
      style={styles.button}
      testID={testID}
    >
      <AppText size={size} weight={700} color={TONE[tone]} align="center">
        {label}
      </AppText>
    </Tappable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
});
