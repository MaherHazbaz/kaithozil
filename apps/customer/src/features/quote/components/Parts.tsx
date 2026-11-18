import {
  AppText,
  Gradient,
  Icon,
  color,
  radius,
  shadow,
  type GradientName,
  type IconName,
} from '@kaithozhil/ui';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

export type DetailRowProps = {
  label: string;
  /** Small muted line under the label ("Labour and parts"). */
  labelDetail?: string;
  value: string;
  /** Small muted line under the value ("2 painters"). */
  valueDetail?: string;
  /**
   * "quote": QuoteView.dc.html (top-aligned, value 700).
   * "summary": JobProgress and ChangeRequest (centred, value 800).
   */
  variant: 'quote' | 'summary';
  /** Read instead of the value ("₹7,200 ✓" is spoken as "₹7,200 paid"). */
  valueLabel?: string;
};

/** A label on the left and an amount on the right, with a divider below (padding 9 0, text 13). */
export function DetailRow({
  label,
  labelDetail,
  value,
  valueDetail,
  variant,
  valueLabel,
}: DetailRowProps) {
  const summary = variant === 'summary';
  return (
    // One element for screen readers: "Labour, ₹9,600, 2 painters".
    <View
      style={[styles.row, summary ? styles.centred : null]}
      accessible
      accessibilityLabel={[label, labelDetail, valueLabel ?? value, valueDetail]
        .filter(Boolean)
        .join(', ')}
    >
      <View style={styles.left}>
        <AppText size={13} color={color.muted}>
          {label}
        </AppText>
        {labelDetail ? (
          <AppText size={11} color={color.muted}>
            {labelDetail}
          </AppText>
        ) : null}
      </View>
      <View style={styles.right}>
        <AppText size={13} weight={summary ? 800 : 700} align="right">
          {value}
        </AppText>
        {valueDetail ? (
          <AppText size={11} color={color.muted} align="right">
            {valueDetail}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

const PLACEHOLDERS: readonly GradientName[] = [
  'photoPlaceholder1',
  'photoPlaceholder2',
  'photoPlaceholder3',
];

export type PhotoPlaceholderProps = {
  /** 0-based; picks the design's lavender, mango or deep lavender fill in turn. */
  index: number;
  label: string;
  iconSize: number;
  /** Square tile in a row (aspect 1) or a fixed height (ChangeRequest's 120pt photo). */
  height?: number;
  borderRadius: number;
};

/**
 * A photo still to be loaded, drawn as the design's gradient with an image
 * icon. Real photos replace it once uploads exist (Supabase Storage, Sprint 2).
 */
export function PhotoPlaceholder({
  index,
  label,
  iconSize,
  height,
  borderRadius,
}: PhotoPlaceholderProps) {
  return (
    <Gradient
      name={PLACEHOLDERS[index % PLACEHOLDERS.length] ?? 'photoPlaceholder1'}
      accessible
      accessibilityRole="image"
      accessibilityLabel={label}
      style={[
        styles.photo,
        { borderRadius },
        height === undefined ? styles.square : { height, alignSelf: 'stretch' },
      ]}
    >
      <Icon name="image" size={iconSize} color={color.purple} />
    </Gradient>
  );
}

/** The 96pt purple disc with a gold icon ("Visit booked" on QuoteRequest.dc.html). */
export function HeroDisc({ icon }: { icon: IconName }) {
  return (
    // The shadow sits on this wrapper: the gradient clips to its circle and could not show it.
    <View style={styles.discShadow}>
      <Gradient name="hero" style={styles.disc}>
        <Icon name={icon} size={42} color={color.gold} />
      </Gradient>
    </View>
  );
}

/**
 * A lavender note with an 18pt lock (QuoteView.dc.html). InfoNote draws a
 * 16pt icon, so this one is local.
 */
export function LockNote({ children }: { children: ReactNode }) {
  return (
    <View style={styles.note}>
      <Icon name="lock" size={18} color={color.purple} />
      <AppText size={12} lineHeight={12 * 1.45} style={styles.flex}>
        {children}
      </AppText>
    </View>
  );
}

const DISC = 96;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: color.border,
  },
  centred: { alignItems: 'center' },
  left: { flexShrink: 1 },
  right: {
    flexShrink: 1,
    alignItems: 'flex-end',
  },
  photo: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  square: {
    flex: 1,
    aspectRatio: 1,
  },
  discShadow: {
    width: DISC,
    height: DISC,
    borderRadius: DISC / 2,
    boxShadow: shadow.button,
  },
  disc: {
    flex: 1,
    borderRadius: DISC / 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 12,
    borderRadius: radius.note,
    backgroundColor: color.lavender,
  },
});
