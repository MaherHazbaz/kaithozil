// The opening animation's timeline, as pure functions of progress (0..1 over 6 s).
// Every number here is copied from design/source/Splash.dc.html.
//
// WHY one progress value: the design runs every element off the same 6 s clock.
// Driving everything from a single number guarantees the elements can never
// drift apart, and makes any frame reproducible (handy for tests and for
// comparing against design/screenshots/Splash_frame_*.png).
//
// WHY 'worklet': Reanimated runs animation code on the UI thread, in a separate
// JavaScript runtime, so animations stay smooth even when React is busy. A
// function marked 'worklet' is copied to that runtime. These functions still
// work as ordinary functions on the JS thread, which is how the tests call them.

export const SPLASH_DURATION_MS = 6000;
/** The design navigates 0.4 s after the animation ends (setTimeout 6400). */
export const SPLASH_NAVIGATE_MS = 6400;
/** `kzRise` runs for 4 s, not 6. */
const RISE_DURATION_MS = 4000;
const RISE_DISTANCE = 760;
/** `kzShimmer`: one pass every 4 s. */
export const SHIMMER_PERIOD_MS = 4000;

/** The design frame the keyframes were authored in. */
export const SPLASH_FRAME = { width: 390, height: 844 } as const;

/** Giant letters: SVG text at font-size 1100, baseline y 818, stretched to 3800 wide. */
export const BIG_TEXT = {
  text: 'KAITHOZHIL',
  fontSize: 1100,
  baselineY: 818,
  textLength: 3800,
  /** The gradient rectangle behind the letters is 1688 tall. */
  gradientHeight: 1688,
} as const;

/** The title word: Anton 58, line-height 1, positioned at 50% - 34. */
export const WORD = {
  text: 'KAITHOZHIL',
  fontSize: 58,
  lineHeight: 58,
  topFromCentre: -34,
} as const;

// @keyframes kzBig: translate(x, y) scale(s) at every 2% from 0% to 100% (51 stops).
// prettier-ignore
const BIG_TX = [
  -805.0, -880.2, -954.0, -1026.2, -1096.8, -1166.0, -1233.6, -1299.8, -1364.4, -1427.4,
  -1488.1, -1541.7, -1583.8, -1610.5, -1619.2, -1608.3, -1577.2, -1526.7, -1458.2, -1374.2,
  -1278.0, -1173.4, -1064.8, -956.5, -853.1, -758.7, -677.1, -611.0, -562.3, -531.4,
  -516.8, -515.4, -521.5, -528.7, -535.5, -541.8, -547.8, -553.3, -558.5, -563.2,
  -567.5, -571.4, -574.9, -577.9, -580.6, -582.9, -584.7, -586.2, -587.2, -587.8,
  -588.0,
];
// prettier-ignore
const BIG_TY = [
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.3, 1.8, 5.6, 12.3, 22.2, 35.5, 52.0, 71.4, 93.2, 116.8,
  141.5, 166.6, 191.3, 214.9, 236.7, 256.0, 272.5, 285.8, 295.8, 302.5,
  306.3, 307.8, 308.1, 308.1, 308.1, 308.1, 308.1, 308.1, 308.1, 308.1,
  308.1, 308.1, 308.1, 308.1, 308.1, 308.1, 308.1, 308.1, 308.1, 308.1,
  308.1,
];
// prettier-ignore
const BIG_SCALE = [
  1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
  0.9994, 0.9958, 0.9868, 0.9709, 0.9473, 0.9158, 0.8767, 0.8308, 0.7792, 0.7233,
  0.6647, 0.6053, 0.5467, 0.4908, 0.4392, 0.3933, 0.3542, 0.3227, 0.2991, 0.2832,
  0.2742, 0.2706, 0.27, 0.27, 0.27, 0.27, 0.27, 0.27, 0.27, 0.27,
  0.27, 0.27, 0.27, 0.27, 0.27, 0.27, 0.27, 0.27, 0.27, 0.27,
  0.27,
];

export type BigTransform = { tx: number; ty: number; scale: number };

/** `prefers-reduced-motion`: the design shows this fixed final framing. */
export const REDUCED_MOTION_BIG: BigTransform = { tx: -650, ty: 308.1, scale: 0.27 };

function clamp01(value: number): number {
  'worklet';
  return Math.min(1, Math.max(0, value));
}

/** Linear interpolation between evenly spaced keyframes (`animation-timing-function: linear`). */
function sampleKeyframes(values: number[], progress: number): number {
  'worklet';
  const position = clamp01(progress) * (values.length - 1);
  const index = Math.min(values.length - 2, Math.floor(position));
  const fraction = position - index;
  const from = values[index] ?? 0;
  const to = values[index + 1] ?? from;
  return from + (to - from) * fraction;
}

/**
 * CSS `cubic-bezier(x1, y1, x2, y2)` evaluated at x (0..1).
 * Solves for the curve parameter with Newton's method, then returns y.
 */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number, x: number): number {
  'worklet';
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;

  let t = x;
  for (let i = 0; i < 8; i++) {
    const error = ((ax * t + bx) * t + cx) * t - x;
    if (Math.abs(error) < 1e-6) break;
    const slope = (3 * ax * t + 2 * bx) * t + cx;
    if (Math.abs(slope) < 1e-6) break;
    t -= error / slope;
  }
  t = clamp01(t);
  return ((ay * t + by) * t + cy) * t;
}

function easeInOut(x: number): number {
  'worklet';
  return cubicBezier(0.42, 0, 0.58, 1, x); // CSS `ease-in-out`
}

function easeOut(x: number): number {
  'worklet';
  return cubicBezier(0, 0, 0.58, 1, x); // CSS `ease-out`
}

function emphasized(x: number): number {
  'worklet';
  return cubicBezier(0.22, 1, 0.36, 1, x); // the design's cubic-bezier for logo and word
}

/** How far through the keyframe interval [from, to] we are, 0..1 (before easing). */
function between(progress: number, from: number, to: number): number {
  'worklet';
  return clamp01((progress - from) / (to - from));
}

/** kzBig: the camera pan and zoom over the giant letters. */
export function bigTransformAt(progress: number): BigTransform {
  'worklet';
  return {
    tx: sampleKeyframes(BIG_TX, progress),
    ty: sampleKeyframes(BIG_TY, progress),
    scale: sampleKeyframes(BIG_SCALE, progress),
  };
}

/** kzRise: how far the letter gradient has risen, in design px. */
export function riseAt(progress: number): number {
  'worklet';
  const elapsedMs = clamp01(progress) * SPLASH_DURATION_MS;
  return RISE_DISTANCE * Math.min(1, elapsedMs / RISE_DURATION_MS);
}

/** kzFillA / kzFillB / kzSky / kzEnd: the four crossfading layers. */
export function layersAt(progress: number): {
  gradientLetters: number;
  darkLetters: number;
  sky: number;
  end: number;
} {
  'worklet';
  const crossfade = easeInOut(between(progress, 0.22, 0.42));
  const dusk = easeInOut(between(progress, 0.5, 0.72));
  return {
    gradientLetters: 1 - crossfade,
    darkLetters: crossfade,
    // Fades in with the crossfade, holds until 50%, fades out as the end sky fades in.
    sky: crossfade - dusk,
    end: dusk,
  };
}

/** kzLogo: rises 16 px and scales 0.86 -> 1 between 62% and 82%. */
export function logoAt(progress: number): { opacity: number; translateY: number; scale: number } {
  'worklet';
  const q = emphasized(between(progress, 0.62, 0.82));
  return { opacity: q, translateY: 16 * (1 - q), scale: 0.86 + 0.14 * q };
}

/** kzWord: fades in from blur 4, scale 1.12 and letter-spacing 10 between 58% and 80%. */
export function wordAt(progress: number): {
  opacity: number;
  scale: number;
  letterSpacing: number;
  blur: number;
} {
  'worklet';
  const q = emphasized(between(progress, 0.58, 0.8));
  return { opacity: q, scale: 1.12 - 0.12 * q, letterSpacing: 10 - 8 * q, blur: 4 * (1 - q) };
}

/** kzUp: the Tamil name rises 10 px between 72% and 90%. */
export function tamilAt(progress: number): { opacity: number; translateY: number } {
  'worklet';
  const q = easeOut(between(progress, 0.72, 0.9));
  return { opacity: q, translateY: 10 * (1 - q) };
}
