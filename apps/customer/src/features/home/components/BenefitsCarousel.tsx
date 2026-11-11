import {
  AppText,
  Gradient,
  IconBox,
  Tappable,
  color,
  radius,
  shadow,
  type GradientName,
  type IconBoxTone,
  type IconName,
} from '@kaithozhil/ui';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { homeCopy } from '../copy';
import { useAutoCarousel } from '../hooks/useAutoCarousel';

type Slide = {
  /** Short name used in the dot's screen-reader label. */
  name: string;
  gradient: GradientName;
  tamil: string;
  title: string;
  body: string;
  labelColor: string;
  titleColor: string;
  bodyColor: string;
  icon: IconName;
  iconTone: IconBoxTone;
};

// The four slides of design/source/Main.dc.html, in order.
const SLIDES: readonly Slide[] = [
  {
    name: 'Verified workers',
    gradient: 'hero',
    tamil: 'சரிபார்க்கப்பட்ட தொழிலாளர்கள்',
    title: 'Verified workers only',
    body: 'ID-checked and skill-tested before their first job.',
    labelColor: color.gold,
    titleColor: color.white,
    bodyColor: color.lavenderText,
    icon: 'badgeCheck',
    iconTone: 'gold',
  },
  {
    name: 'Direct UPI payment',
    gradient: 'goldButton',
    tamil: 'நேரடி UPI பணம்',
    title: 'Pay the worker directly',
    body: 'UPI straight to their bank. No middleman cut.',
    labelColor: color.goldInk,
    titleColor: color.purpleDeep,
    bodyColor: color.goldInk,
    icon: 'wallet',
    iconTone: 'deep',
  },
  {
    name: 'Price first',
    gradient: 'slideNight',
    tamil: 'முதலிலேயே விலை',
    title: 'Know the price first',
    body: 'See an estimate before you book. Final price agreed on site.',
    labelColor: color.gold,
    titleColor: color.white,
    bodyColor: color.lavenderText,
    icon: 'file',
    iconTone: 'onDark',
  },
  {
    name: 'Safe at your door',
    gradient: 'slideLavender',
    tamil: 'பாதுகாப்பான சேவை',
    title: 'Safe at your door',
    body: 'A 4-digit start code makes sure the right worker arrives.',
    labelColor: color.purple,
    titleColor: color.ink,
    bodyColor: color.muted,
    icon: 'shield',
    iconTone: 'purple',
  },
];

/** 3.5 s per slide (DESIGN.md). */
const SLIDE_INTERVAL_MS = 3500;
/** CSS `transition: transform 0.45s ease`. `ease` is cubic-bezier(0.25, 0.1, 0.25, 1). */
const SLIDE_TRANSITION = { duration: 450, easing: Easing.bezier(0.25, 0.1, 0.25, 1) };
/** CSS `transition: width 0.3s` on the dots. */
const DOT_TRANSITION = { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) };

function Dot({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) {
  // The active dot stretches from 8 to 20 pt; the colour switches immediately.
  const dotStyle = useAnimatedStyle(() => ({
    width: withTiming(active ? 20 : 8, DOT_TRANSITION),
  }));
  return (
    <Tappable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      // The design's dot buttons are 28 x 24; hitSlop makes the touch area 44 pt tall.
      hitSlop={{ top: 10, bottom: 10 }}
      style={styles.dotButton}
    >
      <Animated.View
        style={[styles.dot, active ? styles.dotActive : styles.dotInactive, dotStyle]}
      />
    </Tappable>
  );
}

/**
 * "Why Kaithozhil" carousel: four slides, auto-advancing every 3.5 s, with
 * tappable dots. The slide strip moves with a Reanimated transform, which runs
 * on the UI thread, so it stays smooth while React is busy.
 */
export function BenefitsCarousel() {
  const { index, select } = useAutoCarousel(SLIDES.length, SLIDE_INTERVAL_MS);
  const [width, setWidth] = useState(0);
  const offset = useSharedValue(0);

  useEffect(() => {
    // Under the system "reduce motion" setting Reanimated jumps straight to the
    // target instead of animating.
    offset.set(withTiming(-index * width, SLIDE_TRANSITION));
  }, [index, width, offset]);

  const stripStyle = useAnimatedStyle(() => ({ transform: [{ translateX: offset.value }] }));

  return (
    <View style={styles.block} accessibilityLabel={homeCopy.carouselLabel}>
      {/* Shadow on the outer view; the inner view clips the sliding strip. */}
      <View style={styles.shadow}>
        <View style={styles.clip} onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
          <Animated.View style={[styles.strip, stripStyle]}>
            {SLIDES.map((slide, slideIndex) => (
              <Gradient
                key={slide.name}
                name={slide.gradient}
                style={styles.slide}
                // Off-screen slides are hidden from screen readers.
                importantForAccessibility={slideIndex === index ? 'auto' : 'no-hide-descendants'}
                accessibilityElementsHidden={slideIndex !== index}
              >
                <View style={styles.slideText}>
                  <AppText size={11} weight={800} color={slide.labelColor} letterSpacing={0.4}>
                    {slide.tamil}
                  </AppText>
                  <AppText
                    size={21}
                    weight={800}
                    color={slide.titleColor}
                    lineHeight={21 * 1.15}
                    letterSpacing={-0.3}
                  >
                    {slide.title}
                  </AppText>
                  <AppText size={13} color={slide.bodyColor} lineHeight={13 * 1.35}>
                    {slide.body}
                  </AppText>
                </View>
                <IconBox
                  icon={slide.icon}
                  tone={slide.iconTone}
                  size={78}
                  radius="slideIcon"
                  iconSize={38}
                  strokeWidth={1.8}
                />
              </Gradient>
            ))}
          </Animated.View>
        </View>
      </View>

      <View style={styles.dots}>
        {SLIDES.map((slide, slideIndex) => (
          <Dot
            key={slide.name}
            active={slideIndex === index}
            label={homeCopy.showSlide(slideIndex + 1, slide.name)}
            onPress={() => select(slideIndex)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    gap: 6,
  },
  shadow: {
    borderRadius: radius.heroCard,
    boxShadow: shadow.button,
  },
  clip: {
    borderRadius: radius.heroCard,
    overflow: 'hidden',
  },
  strip: {
    flexDirection: 'row',
  },
  slide: {
    // Each slide is exactly as wide as the carousel and never shrinks
    // (CSS `flex: 0 0 100%`), so the strip is four carousels wide.
    width: '100%',
    flexShrink: 0,
    minHeight: 150,
    borderRadius: radius.heroCard,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    overflow: 'hidden',
  },
  slideText: {
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 0,
    gap: 4,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dotButton: {
    width: 28,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    height: 8,
    borderRadius: radius.dot,
  },
  dotActive: {
    backgroundColor: color.purple,
  },
  dotInactive: {
    backgroundColor: color.dotInactive,
  },
});
