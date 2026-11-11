import { AppText, Logo, color } from '@kaithozhil/ui';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { SplashCanvas } from '../components/SplashCanvas';
import { splashCopy } from '../copy';
import {
  SHIMMER_PERIOD_MS,
  SPLASH_DURATION_MS,
  SPLASH_NAVIGATE_MS,
  logoAt,
  tamilAt,
} from '../splashTimeline';

export type SplashScreenProps = {
  /** Called once: after 6.4 s, or immediately when the user taps. */
  onDone: () => void;
  /**
   * Development only: draw the frame at this time (seconds) and stay there,
   * without navigating. Used to compare against design/screenshots/Splash_frame_*.png.
   */
  frozenAtSeconds?: number;
};

/**
 * Opening animation (design/source/Splash.dc.html).
 * 6 s timeline, then Welcome at 6.4 s; tap anywhere to skip; with the system
 * "reduce motion" setting on, the final state is shown without animation.
 */
export function SplashScreen({ onDone, frozenAtSeconds }: SplashScreenProps) {
  const reducedMotion = useReducedMotion();
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const [canvasReady, setCanvasReady] = useState(false);

  // Shared values live on the UI thread; changing them does not re-render React.
  const progress = useSharedValue(0);
  const shimmer = useSharedValue(0);

  // Guard so a tap and the timer cannot both navigate.
  const finished = useRef(false);
  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    onDone();
  }, [onDone]);

  useEffect(() => {
    if (!canvasReady) return;

    if (frozenAtSeconds !== undefined) {
      progress.set(Math.min(1, Math.max(0, (frozenAtSeconds * 1000) / SPLASH_DURATION_MS)));
      return;
    }

    if (reducedMotion) {
      progress.set(1);
    } else {
      progress.set(withTiming(1, { duration: SPLASH_DURATION_MS, easing: Easing.linear }));
      shimmer.set(
        withRepeat(withTiming(1, { duration: SHIMMER_PERIOD_MS, easing: Easing.linear }), -1),
      );
    }
    const timer = setTimeout(finish, SPLASH_NAVIGATE_MS);

    return () => {
      clearTimeout(timer);
      cancelAnimation(progress);
      cancelAnimation(shimmer);
    };
  }, [canvasReady, frozenAtSeconds, reducedMotion, finish, progress, shimmer]);

  const logoStyle = useAnimatedStyle(() => {
    const logo = logoAt(progress.value);
    return {
      opacity: logo.opacity,
      transform: [{ translateY: logo.translateY }, { scale: logo.scale }],
    };
  });

  const tamilStyle = useAnimatedStyle(() => {
    const tamil = tamilAt(progress.value);
    return { opacity: tamil.opacity, transform: [{ translateY: tamil.translateY }] };
  });

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setSize((prev) =>
      prev && prev.width === width && prev.height === height ? prev : { width, height },
    );
  };

  const handleReady = useCallback(() => setCanvasReady(true), []);

  return (
    <View style={styles.root} onLayout={handleLayout} testID="splash-root">
      {/* Light status bar icons over the dark animation. */}
      <StatusBar style="light" />

      {size ? (
        <SplashCanvas
          progress={progress}
          shimmer={shimmer}
          width={size.width}
          height={size.height}
          reducedMotion={reducedMotion}
          onReady={handleReady}
        />
      ) : null}

      {/* Logo: centred, lifted 105 pt above the middle by its 210 pt bottom margin. */}
      <View style={styles.logoLayer} pointerEvents="none">
        <Animated.View style={[styles.logo, logoStyle]}>
          <Logo size={108} radius="logoSplash" shadow="logoSplash" />
        </Animated.View>
      </View>

      {/* Tamil name: 64 pt below the middle. */}
      <View style={styles.tamilLayer} pointerEvents="none">
        <Animated.View style={tamilStyle}>
          <AppText size={17} weight={600} color={color.lavenderText} letterSpacing={1}>
            {splashCopy.tamilName}
          </AppText>
        </Animated.View>
      </View>

      {/* The whole screen is one button: tap anywhere to skip. */}
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={finish}
        accessibilityRole="button"
        accessibilityLabel={splashCopy.continueLabel}
        testID="splash-skip"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: color.purpleBlack,
    overflow: 'hidden',
  },
  logoLayer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    marginBottom: 210,
  },
  tamilLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    marginTop: 64,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});
