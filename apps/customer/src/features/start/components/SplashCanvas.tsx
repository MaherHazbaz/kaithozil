import { antonFontAsset, color, gradient } from '@kaithozhil/ui';
import {
  Blur,
  Canvas,
  Fill,
  Glyphs,
  Group,
  LinearGradient,
  Paint,
  Path,
  Rect,
  Skia,
  useFont,
} from '@shopify/react-native-skia';
import { useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useDerivedValue, type SharedValue } from 'react-native-reanimated';

import {
  BIG_TEXT,
  REDUCED_MOTION_BIG,
  SPLASH_FRAME,
  WORD,
  bigTransformAt,
  layersAt,
  riseAt,
  wordAt,
} from '../splashTimeline';

export type SplashCanvasProps = {
  /** 0..1 over the 6 s timeline. */
  progress: SharedValue<number>;
  /** 0..1, looping every 4 s: the shimmer's position. */
  shimmer: SharedValue<number>;
  /** Screen size in points. */
  width: number;
  height: number;
  /** System "reduce motion" is on: show the design's fixed final framing. */
  reducedMotion: boolean;
  /** Called once the fonts are loaded and the first real frame can be drawn. */
  onReady: () => void;
};

// Skia gradients take mutable arrays; the tokens are readonly tuples.
const LETTERS = {
  colors: [...gradient.splashLetters.colors],
  positions: [...gradient.splashLetters.locations],
};
const SKY = {
  colors: [...gradient.splashSky.colors],
  positions: [...gradient.splashSky.locations],
};
const END = {
  colors: [...gradient.splashEnd.colors],
  positions: [...gradient.splashEnd.locations],
};
const SHIMMER = {
  colors: [...gradient.splashShimmer.colors],
  positions: [...gradient.splashShimmer.locations],
};

/**
 * The drawn part of the opening animation: sky backgrounds, the giant
 * gradient-filled letters, and the shimmering title word.
 *
 * WHY Skia: React Native's <Text> cannot be filled with a gradient, stretched,
 * or blurred. Skia is a 2D drawing canvas (the engine behind Chrome and
 * Android's own UI) where text is just a shape we can fill and transform.
 * Skia reads Reanimated shared values directly, so every frame is drawn on the
 * UI thread without React re-rendering.
 */
export function SplashCanvas({
  progress,
  shimmer,
  width,
  height,
  reducedMotion,
  onReady,
}: SplashCanvasProps) {
  const bigFont = useFont(antonFontAsset, BIG_TEXT.fontSize);
  const wordFont = useFont(antonFontAsset, WORD.fontSize);

  // The giant letters as one vector outline, built once.
  const big = useMemo(() => {
    if (!bigFont) return null;
    const path = Skia.Path.MakeFromText(BIG_TEXT.text, 0, BIG_TEXT.baselineY, bigFont);
    if (!path) return null;
    // SVG `textLength="3800" lengthAdjust="spacingAndGlyphs"` stretches the
    // glyphs so the text's advance width is exactly 3800.
    const advance = bigFont
      .getGlyphWidths(bigFont.getGlyphIDs(BIG_TEXT.text))
      .reduce((sum, w) => sum + w, 0);
    return { path, stretchX: BIG_TEXT.textLength / advance };
  }, [bigFont]);

  // Glyph ids, widths and vertical metrics for the title word, measured once.
  const word = useMemo(() => {
    if (!wordFont) return null;
    const ids = wordFont.getGlyphIDs(WORD.text);
    const widths = wordFont.getGlyphWidths(ids);
    const metrics = wordFont.getMetrics();
    // CSS `line-height: 1`: the font's ascent+descent box is centred in a 58 px
    // line, which puts the baseline here (Skia's ascent is negative).
    const baselineInLine =
      (WORD.lineHeight - (metrics.descent - metrics.ascent)) / 2 - metrics.ascent;
    return { ids, widths, baselineInLine };
  }, [wordFont]);

  const ready = big !== null && word !== null;
  useEffect(() => {
    if (ready) onReady();
  }, [ready, onReady]);

  // The letters "fill the screen height" (DESIGN.md), so the 390 x 844 scene is
  // scaled by height and centred horizontally on other screen sizes.
  const sceneScale = height / SPLASH_FRAME.height;
  const sceneOffsetX = (width - SPLASH_FRAME.width * sceneScale) / 2;

  const layers = useDerivedValue(() => layersAt(progress.value));
  const gradientLettersOpacity = useDerivedValue(() => layers.value.gradientLetters);
  const darkLettersOpacity = useDerivedValue(() => layers.value.darkLetters);
  const skyOpacity = useDerivedValue(() => layers.value.sky);
  const endOpacity = useDerivedValue(() => layers.value.end);

  // CSS `translate(x, y) scale(s)` with transform-origin 0 0.
  const bigTransform = useDerivedValue(() => {
    const t = reducedMotion ? REDUCED_MOTION_BIG : bigTransformAt(progress.value);
    return [{ translateX: t.tx }, { translateY: t.ty }, { scale: t.scale }];
  });

  // kzRise: the gradient behind the letters slides up 760 px over 4 s.
  const letterGradientStart = useDerivedValue(() => ({ x: 0, y: -riseAt(progress.value) }));
  const letterGradientEnd = useDerivedValue(() => ({
    x: 0,
    y: BIG_TEXT.gradientHeight - riseAt(progress.value),
  }));

  // Title word layout. CSS adds letter-spacing after every character
  // (including the last), and centres that whole box.
  const wordLayout = useDerivedValue(() => {
    const spacing = wordAt(progress.value).letterSpacing;
    const widths = word?.widths ?? [];
    let total = 0;
    for (const w of widths) total += w + spacing;
    return {
      spacing,
      total,
      left: (width - total) / 2,
      baseline: height / 2 + WORD.topFromCentre + (word?.baselineInLine ?? 0),
    };
  });

  const wordGlyphs = useDerivedValue(() => {
    const { spacing, left, baseline } = wordLayout.value;
    const ids = word?.ids ?? [];
    const widths = word?.widths ?? [];
    let x = left;
    return ids.map((id, index) => {
      const glyph = { id, pos: { x, y: baseline } };
      x += (widths[index] ?? 0) + spacing;
      return glyph;
    });
  });

  // kzShimmer: `background-size: 200%` makes the gradient twice the word's
  // width; moving background-position 0% -> 200% slides it left by exactly one
  // gradient length, and it repeats seamlessly (first and last colours match).
  const shimmerStart = useDerivedValue(() => {
    const { left, total } = wordLayout.value;
    return { x: left - 2 * total * shimmer.value, y: 0 };
  });
  const shimmerEnd = useDerivedValue(() => {
    const { left, total } = wordLayout.value;
    return { x: left - 2 * total * shimmer.value + 2 * total, y: 0 };
  });

  const wordOpacity = useDerivedValue(() => wordAt(progress.value).opacity);
  const wordBlur = useDerivedValue(() => wordAt(progress.value).blur);
  const wordTransform = useDerivedValue(() => [{ scale: wordAt(progress.value).scale }]);
  // The word scales about the centre of its 58 px line box.
  const wordOrigin = { x: width / 2, y: height / 2 + WORD.topFromCentre + WORD.lineHeight / 2 };

  return (
    <Canvas style={StyleSheet.absoluteFill}>
      <Fill color={color.purpleBlack} />

      <Rect x={0} y={0} width={width} height={height} opacity={skyOpacity}>
        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 0, y: height }} {...SKY} />
      </Rect>
      <Rect x={0} y={0} width={width} height={height} opacity={endOpacity}>
        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 0, y: height }} {...END} />
      </Rect>

      {big ? (
        <Group transform={[{ translateX: sceneOffsetX }, { scale: sceneScale }]}>
          <Group transform={bigTransform}>
            <Group transform={[{ scaleX: big.stretchX }]}>
              {/* kz-fillA: letters filled with the rising sky gradient. */}
              <Path path={big.path} opacity={gradientLettersOpacity}>
                <LinearGradient start={letterGradientStart} end={letterGradientEnd} {...LETTERS} />
              </Path>
              {/* kz-fillB: the same letters as a dark shadow over the sky. */}
              <Path path={big.path} color={color.letterShadow} opacity={darkLettersOpacity} />
            </Group>
          </Group>
        </Group>
      ) : null}

      {word ? (
        <Group
          origin={wordOrigin}
          transform={wordTransform}
          // A "layer" draws the children off-screen first, so opacity and blur
          // apply to the word as a whole (like CSS opacity/filter on an element).
          layer={
            <Paint opacity={wordOpacity}>
              <Blur blur={wordBlur} />
            </Paint>
          }
        >
          <Glyphs font={wordFont} glyphs={wordGlyphs} x={0} y={0}>
            <LinearGradient start={shimmerStart} end={shimmerEnd} mode="repeat" {...SHIMMER} />
          </Glyphs>
        </Group>
      ) : null}
    </Canvas>
  );
}
