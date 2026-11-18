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
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

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
    body: 'Two door codes confirm the right worker arrived and started.',
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
// Dragging by hand is NOT in the design, which only has auto-advance and dots.
/** How far a drag must go, as a share of the slide width, to change slide. */
const SWIPE_DISTANCE = 0.25;
/** A flick faster than this (points per second) changes slide whatever the distance. */
const SWIPE_VELOCITY = 500;
/** How much the strip follows the finger when pulled past the first or last slide. */
const EDGE_RESISTANCE = 0.3;
/** A drag must move this far sideways to start, and fails if it moves this far up or down first. */
const DRAG_SLOP = 12;

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
 * tappable dots, and draggable by hand. The slide strip moves with a
 * Reanimated transform, which runs on the UI thread, so it stays smooth while
 * React is busy.
 */
export function BenefitsCarousel() {
  const { index, select, setPaused } = useAutoCarousel(SLIDES.length, SLIDE_INTERVAL_MS);
  const [width, setWidth] = useState(0);
  const offset = useSharedValue(0);
  // Copies of `index` and `width` that the gesture can read on the UI thread.
  const indexValue = useSharedValue(0);
  const widthValue = useSharedValue(0);

  useEffect(() => {
    // Under the system "reduce motion" setting Reanimated jumps straight to the
    // target instead of animating.
    offset.set(withTiming(-index * width, SLIDE_TRANSITION));
    indexValue.set(index);
    widthValue.set(width);
  }, [index, width, offset, indexValue, widthValue]);

  const settle = useCallback(
    (next: number) => {
      // Also restarts the countdown, so the slide gets its full time on screen.
      select(next);
      setPaused(false);
    },
    [select, setPaused],
  );

  // The gesture callbacks are worklets: they run on the UI thread, so the
  // strip follows the finger without waiting for React. `scheduleOnRN` calls
  // back into React when its state has to change.
  const drag = usePanGesture({
    // Only a sideways drag starts this; an up or down drag is left to the
    // page so Home still scrolls.
    activeOffsetX: [-DRAG_SLOP, DRAG_SLOP],
    failOffsetY: [-DRAG_SLOP, DRAG_SLOP],
    onActivate: () => {
      'worklet';
      // No auto-advance while a finger is holding the slides.
      scheduleOnRN(setPaused, true);
    },
    onUpdate: (event) => {
      'worklet';
      const last = SLIDES.length - 1;
      const pastEdge =
        (indexValue.get() === 0 && event.translationX > 0) ||
        (indexValue.get() === last && event.translationX < 0);
      offset.set(
        -indexValue.get() * widthValue.get() +
          event.translationX * (pastEdge ? EDGE_RESISTANCE : 1),
      );
    },
    onDeactivate: (event) => {
      'worklet';
      let next = indexValue.get();
      const far = Math.abs(event.translationX) > widthValue.get() * SWIPE_DISTANCE;
      const fast = Math.abs(event.velocityX) > SWIPE_VELOCITY;
      if (!event.canceled && (far || fast)) {
        const step = event.translationX < 0 ? 1 : -1;
        next = Math.min(SLIDES.length - 1, Math.max(0, next + step));
      }
      // Settle here too: when the slide does not change, React has nothing
      // to re-render and the effect above would not run.
      offset.set(withTiming(-next * widthValue.get(), SLIDE_TRANSITION));
      scheduleOnRN(settle, next);
    },
  });

  const stripStyle = useAnimatedStyle(() => ({ transform: [{ translateX: offset.value }] }));

  return (
    <View style={styles.block} accessibilityLabel={homeCopy.carouselLabel}>
      {/* Shadow on the outer view; the inner view clips the sliding strip. */}
      <View style={styles.shadow}>
        <GestureDetector gesture={drag}>
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
        </GestureDetector>
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
