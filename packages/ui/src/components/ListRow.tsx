import { StyleSheet, View } from 'react-native';

import { color } from '../tokens';
import { AppText } from './AppText';
import { Icon, type IconName } from './Icon';
import { IconBox } from './IconBox';
import { Tappable } from './Tappable';

export type ListRowProps = {
  icon: IconName;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  /** Draw the 1pt divider under the row. Default true. */
  divider?: boolean;
  /** Draw the chevron at the end. Default true; "Log out" has none. */
  chevron?: boolean;
  testID?: string;
};

/**
 * Settings-style row: 36pt lavender icon box, title 15/700, muted 12pt
 * subtitle, chevron. Values from design/source/Profile.dc.html.
 */
export function ListRow({
  icon,
  title,
  subtitle,
  onPress,
  divider = true,
  chevron = true,
  testID,
}: ListRowProps) {
  return (
    <Tappable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={subtitle ? `${title}, ${subtitle}` : title}
      testID={testID}
      style={[styles.row, divider ? styles.divider : null]}
    >
      <IconBox icon={icon} tone="lavender" size={36} />
      <View style={styles.text}>
        <AppText size={15} weight={700}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText size={12} color={color.muted}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {chevron ? <Icon name="chevronRight" size={18} color={color.muted} /> : null}
    </Tappable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 7,
    paddingHorizontal: 14,
    backgroundColor: color.white,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: color.border,
  },
  text: {
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 0,
    gap: 1,
  },
});
