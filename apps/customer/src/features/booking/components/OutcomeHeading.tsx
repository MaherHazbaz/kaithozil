import {
  AppText,
  Avatar,
  Gradient,
  Icon,
  Ripple,
  color,
  shadow,
  type IconName,
} from '@kaithozhil/ui';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

export type OutcomeHeadingProps = {
  /** OutcomeDisc, drawn inside the heading. Waiting draws WaitingAvatar above it instead. */
  disc?: ReactNode;
  title: string;
  titleTamil: string;
  /** Text, with nested <AppText weight={700}> for bold parts. */
  body: ReactNode;
};

/** The centred title, Tamil title and explanation that open every outcome. */
export function OutcomeHeading({ disc, title, titleTamil, body }: OutcomeHeadingProps) {
  return (
    <View style={styles.heading}>
      {disc}
      <AppText size={21} weight={800} align="center" accessibilityRole="header">
        {title}
      </AppText>
      <AppText size={13} color={color.muted} align="center">
        {titleTamil}
      </AppText>
      <AppText size={14} lineHeight={14 * 1.5} align="center" style={styles.body}>
        {body}
      </AppText>
    </View>
  );
}

/**
 * Waiting for the worker: their initials in a lavender circle with a dashed
 * ring, and the waiting ripple spreading from the avatar.
 */
export function WaitingAvatar({ initials }: { initials: string }) {
  return (
    // Decorative: the title below says the same thing to screen readers.
    <View
      style={styles.waitingRow}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <View style={styles.waitingBox}>
        <View style={styles.waitingFill} />
        <View style={styles.dashedRing} />
        {/* Drawn over the rings and under the avatar; hidden with reduce motion on. */}
        <Ripple kind="waitingRipple" size={AVATAR} />
        <Avatar initials={initials} size={AVATAR} fontSize={21} />
      </View>
    </View>
  );
}

const DISC_TONE = {
  brand: { background: undefined, icon: color.gold, size: 46, strokeWidth: 3 },
  mango: { background: color.mangoTint, icon: color.mangoText, size: 42, strokeWidth: 2 },
  neutral: { background: color.neutralTint, icon: color.muted, size: 42, strokeWidth: 2 },
} as const;

/** A 96pt disc with one icon: purple gradient (accepted), mango (new time), grey (declined). */
export function OutcomeDisc({ icon, tone }: { icon: IconName; tone: keyof typeof DISC_TONE }) {
  const t = DISC_TONE[tone];
  const glyph = <Icon name={icon} size={t.size} color={t.icon} strokeWidth={t.strokeWidth} />;
  return (
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {tone === 'brand' ? (
        // Shadow on the wrapper: the gradient clips to the circle and could not show it.
        <View style={[styles.disc, styles.discShadow]}>
          <Gradient name="hero" style={[styles.disc, styles.clip]}>
            {glyph}
          </Gradient>
        </View>
      ) : (
        <View style={[styles.disc, { backgroundColor: t.background }]}>{glyph}</View>
      )}
    </View>
  );
}

const BOX = 120;
const RING_INSET = 14;
const AVATAR = 64;
const DISC = 96;

const styles = StyleSheet.create({
  heading: {
    alignItems: 'center',
    gap: 10,
    paddingTop: 10,
    paddingBottom: 4,
  },
  body: { maxWidth: 310 },
  waitingRow: { alignItems: 'center' },
  waitingBox: {
    width: BOX,
    height: BOX,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waitingFill: {
    ...StyleSheet.absoluteFill,
    borderRadius: BOX / 2,
    backgroundColor: color.lavender,
  },
  dashedRing: {
    position: 'absolute',
    top: RING_INSET,
    left: RING_INSET,
    right: RING_INSET,
    bottom: RING_INSET,
    borderRadius: (BOX - RING_INSET * 2) / 2,
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: color.lavenderDeep,
  },
  disc: {
    width: DISC,
    height: DISC,
    borderRadius: DISC / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  discShadow: { boxShadow: shadow.button },
  clip: { overflow: 'hidden' },
});
