import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { color, radius } from '../tokens';
import { AppText } from './AppText';
import { Icon, type IconName } from './Icon';

export type InfoNoteProps = {
  /** "info" = lavender (information), "warning" = mango (DESIGN.md "Shared components"). */
  tone: 'info' | 'warning';
  icon: IconName;
  /** Default 2. The tick on Post.dc.html's note is 2.5. */
  iconStrokeWidth?: number;
  /** Text. Nest <AppText weight={700}> for bold parts. */
  children: ReactNode;
};

const TONE = {
  info: { background: color.lavender, border: undefined, icon: color.purple, text: color.ink },
  warning: {
    background: color.mangoTint,
    border: color.mangoBorder,
    icon: color.mangoText,
    text: color.mangoText,
  },
} as const;

/** A tinted note with a 16pt icon (NoInternet.dc.html: radius 14, padding 12, text 12/1.45). */
export function InfoNote({ tone, icon, iconStrokeWidth, children }: InfoNoteProps) {
  const t = TONE[tone];
  return (
    <View
      style={[
        styles.note,
        { backgroundColor: t.background },
        t.border ? { borderWidth: 1, borderColor: t.border } : null,
      ]}
    >
      <Icon name={icon} size={16} color={t.icon} strokeWidth={iconStrokeWidth} />
      <AppText size={12} color={t.text} lineHeight={12 * 1.45} style={styles.text}>
        {children}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 12,
    borderRadius: radius.note,
    flexShrink: 0,
  },
  // Takes the remaining width and wraps, instead of pushing the icon out.
  text: { flex: 1 },
});
