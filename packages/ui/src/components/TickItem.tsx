import { StyleSheet, View } from 'react-native';

import { color } from '../tokens';
import { AppText } from './AppText';
import { Icon } from './Icon';

export type TickItemProps = {
  children: string;
  /**
   * "small": 16pt tick, 13pt text, 8pt gap (Safety, Log out or delete).
   * "large": 18pt tick, 14pt text, 10pt gap (Permissions).
   */
  size?: 'small' | 'large';
};

const SIZE = {
  small: { icon: 16, text: 13, gap: 8 },
  large: { icon: 18, text: 14, gap: 10 },
} as const;

/** One line of a checklist: a purple tick and wrapping text (line height 1.4). */
export function TickItem({ children, size = 'small' }: TickItemProps) {
  const s = SIZE[size];
  return (
    <View style={[styles.row, { gap: s.gap }]}>
      <Icon name="check" size={s.icon} color={color.purple} strokeWidth={2.5} />
      <AppText size={s.text} lineHeight={s.text * 1.4} style={styles.text}>
        {children}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  text: { flex: 1 },
});
