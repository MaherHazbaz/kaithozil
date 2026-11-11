import { StyleSheet, View } from 'react-native';

import { color, radius } from '../tokens';
import { AppText } from './AppText';

export type StatusPillProps = {
  label: string;
  /** "purple": purple on lavender. "mango": mango text on mango tint. */
  tone: 'purple' | 'mango';
};

/** Small status label: 12/700 text, radius 8, padding 4 x 8. */
export function StatusPill({ label, tone }: StatusPillProps) {
  return (
    <View style={[styles.pill, tone === 'purple' ? styles.purple : styles.mango]}>
      <AppText size={12} weight={700} color={tone === 'purple' ? color.purple : color.mangoText}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexShrink: 0,
    borderRadius: radius.statusPill,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  purple: { backgroundColor: color.lavender },
  mango: { backgroundColor: color.mangoTint },
});
