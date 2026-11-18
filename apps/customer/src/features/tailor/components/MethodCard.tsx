import { AppText, IconBox, Tappable, color, radius, type IconName } from '@kaithozhil/ui';
import { StyleSheet, View } from 'react-native';

export type MethodCardProps = {
  icon: IconName;
  title: string;
  titleTamil: string;
  detail: string;
  selected: boolean;
  onPress: () => void;
  testID?: string;
};

/**
 * One full-width "How would you like it?" choice on TailorBook.dc.html: icon
 * box, three lines of text and a radio dot (padding 12 14, radius 16).
 */
export function MethodCard({
  icon,
  title,
  titleTamil,
  detail,
  selected,
  onPress,
  testID,
}: MethodCardProps) {
  return (
    <Tappable
      onPress={onPress}
      // Radio: exactly one way can be chosen.
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={`${title}. ${detail}`}
      accessibilityHint={titleTamil}
      style={[styles.card, selected ? styles.on : styles.off]}
      testID={testID}
    >
      <IconBox icon={icon} tone="lavender" size={40} />
      <View style={styles.text}>
        <AppText size={15} weight={800}>
          {title}
        </AppText>
        <AppText size={11} color={color.muted}>
          {titleTamil}
        </AppText>
        <AppText size={12}>{detail}</AppText>
      </View>
      <View style={[styles.dot, selected ? styles.dotOn : styles.dotOff]} />
    </Tappable>
  );
}

const DOT = 22;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: radius.button,
  },
  // The 1pt border grows to 2pt when chosen with the same padding, so the
  // content shifts by 1pt, exactly as it does in the design.
  on: { borderWidth: 2, borderColor: color.purple, backgroundColor: color.lavender },
  off: { borderWidth: 1, borderColor: color.borderStrong, backgroundColor: color.white },
  text: { flexGrow: 1, flexShrink: 1, gap: 1 },
  // React Native borders are drawn inside the box (CSS box-sizing: border-box),
  // so a 7pt border on a 22pt circle leaves the design's 8pt white centre.
  dot: {
    width: DOT,
    height: DOT,
    flexShrink: 0,
    borderRadius: DOT / 2,
    backgroundColor: color.white,
  },
  dotOn: { borderWidth: 7, borderColor: color.purple },
  dotOff: { borderWidth: 2, borderColor: color.borderStrong },
});
