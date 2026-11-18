import { AppText, color } from '@kaithozhil/ui';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

export type StateMessageProps = {
  title: string;
  titleTamil: string;
  /** 23 on most states; Empty list uses 22. */
  titleSize?: 22 | 23;
  /** Body text. Nest <AppText weight={700}> for bold parts. */
  children: ReactNode;
};

/** Centred title, Tamil line and body text of a system-state screen. */
export function StateMessage({ title, titleTamil, titleSize = 23, children }: StateMessageProps) {
  return (
    <View style={styles.block}>
      <AppText size={titleSize} weight={800} align="center" accessibilityRole="header">
        {title}
      </AppText>
      <AppText size={13} color={color.muted} align="center">
        {titleTamil}
      </AppText>
      <AppText size={15} lineHeight={15 * 1.5} align="center" style={styles.body}>
        {children}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  body: {
    maxWidth: 310,
    paddingTop: 4,
  },
});
