import { AppText, IconBox, Tappable, Toggle, color, radius, type IconName } from '@kaithozhil/ui';
import { StyleSheet, View } from 'react-native';

export type ToggleRowProps = {
  title: string;
  detail: string;
  on: boolean;
  onToggle: () => void;
  /**
   * With an icon: a row inside a grouped card (Language.dc.html, 64pt, divider
   * below). Without: a standalone bordered row (Safety.dc.html, 60pt).
   */
  icon?: IconName;
  testID?: string;
};

/** A setting that is on or off. The whole row is the switch. */
export function ToggleRow({ title, detail, on, onToggle, icon, testID }: ToggleRowProps) {
  const grouped = icon !== undefined;
  return (
    <Tappable
      onPress={onToggle}
      // "switch" makes screen readers say "on" / "off" with the title.
      accessibilityRole="switch"
      accessibilityState={{ checked: on }}
      accessibilityLabel={title}
      accessibilityHint={detail}
      style={[styles.row, grouped ? styles.grouped : styles.standalone]}
      testID={testID}
    >
      {icon ? <IconBox icon={icon} tone="lavender" size={36} /> : null}
      <View style={styles.text}>
        <AppText size={grouped ? 15 : 14} weight={700}>
          {title}
        </AppText>
        <AppText size={12} color={color.muted}>
          {detail}
        </AppText>
      </View>
      <Toggle on={on} />
    </Tappable>
  );
}

/** "Emergency contacts · அவசரத் தொடர்புகள்": a 14/800 heading with a muted Tamil part. */
export function SectionHeading({ title, titleTamil }: { title: string; titleTamil?: string }) {
  return (
    <AppText size={14} weight={800} accessibilityRole="header">
      {title}
      {titleTamil ? (
        <AppText weight={500} color={color.muted}>
          {titleTamil}
        </AppText>
      ) : null}
    </AppText>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: color.white,
  },
  grouped: {
    minHeight: 64,
    borderBottomWidth: 1,
    borderBottomColor: color.border,
  },
  standalone: {
    minHeight: 60,
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: radius.note,
  },
  text: { flex: 1, gap: 1 },
});
