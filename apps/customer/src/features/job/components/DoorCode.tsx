import { AppText, color, radius } from '@kaithozhil/ui';
import { StyleSheet, View } from 'react-native';

export type DoorCodeProps = {
  /** e.g. "Step 1 · Arrival code". */
  title: string;
  titleTamil: string;
  /** Four digits, e.g. "4827". */
  code: string;
  /** Read by screen readers instead of four separate digits, e.g. "Arrival code 4 8 2 7". */
  spokenLabel: string;
  note: string;
  testID?: string;
};

/** A mango card with a 4-digit code the customer reads out at the door (Tracking.dc.html). */
export function DoorCode({ title, titleTamil, code, spokenLabel, note, testID }: DoorCodeProps) {
  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <AppText size={13} weight={800} color={color.mangoText}>
          {title}
        </AppText>
        <AppText size={11} color={color.mangoText}>
          {titleTamil}
        </AppText>
      </View>
      <View style={styles.digits} accessible accessibilityLabel={spokenLabel} testID={testID}>
        {code.split('').map((digit, index) => (
          // The digits never reorder, so the position is a safe key.
          <View key={index} style={styles.digit}>
            <AppText size={26} weight={800} color={color.mangoInk}>
              {digit}
            </AppText>
          </View>
        ))}
      </View>
      <AppText size={12} lineHeight={12 * 1.4} color={color.mangoText}>
        {note}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.mangoTint,
    borderWidth: 1,
    borderColor: color.mangoBorder,
    borderRadius: radius.codeCard,
    padding: 14,
    gap: 8,
  },
  // CSS `align-items: baseline` lines up the two different text sizes.
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 8,
  },
  digits: {
    flexDirection: 'row',
    gap: 8,
  },
  digit: {
    width: 48,
    height: 52,
    borderRadius: radius.codeDigit,
    backgroundColor: color.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
