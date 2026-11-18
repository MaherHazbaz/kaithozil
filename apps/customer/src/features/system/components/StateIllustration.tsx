import { Gradient, Icon, Ripple, color, shadow, type IconName } from '@kaithozhil/ui';
import { StyleSheet, View } from 'react-native';

export type StateIllustrationProps = {
  icon: IconName;
  /**
   * The disc: "neutral" grey (No internet, Empty list), "warning" mango
   * (Something went wrong), "brand" purple gradient (Under maintenance).
   */
  tone: 'neutral' | 'warning' | 'brand';
  /** Waves around the disc (DESIGN.md "Motion": system ripple). */
  ripple?: boolean;
};

const TONE = {
  neutral: { background: color.neutralTint, icon: color.muted },
  warning: { background: color.mangoTint, icon: color.mangoText },
  brand: { background: undefined, icon: color.white },
} as const;

/** Two lavender rings around an 84pt icon disc, as drawn on every system-state screen. */
export function StateIllustration({ icon, tone, ripple = false }: StateIllustrationProps) {
  const t = TONE[tone];
  const glyph = <Icon name={icon} size={ICON} color={t.icon} />;
  return (
    // Decorative: the title below says the same thing to screen readers.
    <View
      style={styles.box}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <View style={[styles.ring, styles.outer]} />
      <View style={[styles.ring, styles.inner]} />
      {ripple ? <Ripple kind="systemRipple" size={DISC} /> : null}
      {/* The shadow sits on this wrapper: a gradient view clips to its corners and could not show it. */}
      <View style={[styles.disc, { backgroundColor: t.background }]}>
        {tone === 'brand' ? (
          <Gradient name="hero" style={[styles.disc, styles.gradient]}>
            {glyph}
          </Gradient>
        ) : (
          glyph
        )}
      </View>
    </View>
  );
}

const BOX = 180;
const INNER = 128;
const DISC = 84;
const ICON = 38;

const styles = StyleSheet.create({
  box: {
    width: BOX,
    height: BOX,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  ring: { position: 'absolute' },
  outer: { width: BOX, height: BOX, borderRadius: BOX / 2, backgroundColor: color.lavender },
  inner: {
    width: INNER,
    height: INNER,
    borderRadius: INNER / 2,
    backgroundColor: color.lavenderText,
  },
  disc: {
    width: DISC,
    height: DISC,
    borderRadius: DISC / 2,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: shadow.stateIcon,
  },
  gradient: { boxShadow: undefined, overflow: 'hidden' },
});
