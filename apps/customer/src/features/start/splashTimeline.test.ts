import {
  bigTransformAt,
  cubicBezier,
  layersAt,
  logoAt,
  riseAt,
  tamilAt,
  wordAt,
} from './splashTimeline';

describe('cubicBezier', () => {
  it('is exact at the ends and symmetric for ease-in-out', () => {
    expect(cubicBezier(0.42, 0, 0.58, 1, 0)).toBe(0);
    expect(cubicBezier(0.42, 0, 0.58, 1, 1)).toBe(1);
    expect(cubicBezier(0.42, 0, 0.58, 1, 0.5)).toBeCloseTo(0.5, 4);
  });

  it('matches a known value of CSS `ease` (cubic-bezier(0.25, 0.1, 0.25, 1))', () => {
    // Reference value from the CSS Easing spec's ease curve at x = 0.5.
    expect(cubicBezier(0.25, 0.1, 0.25, 1, 0.5)).toBeCloseTo(0.8024, 3);
  });
});

describe('opening animation timeline (design/source/Splash.dc.html)', () => {
  it('starts on the gradient letters at the first kzBig keyframe', () => {
    expect(bigTransformAt(0)).toEqual({ tx: -805, ty: 0, scale: 1 });
    expect(layersAt(0)).toEqual({ gradientLetters: 1, darkLetters: 0, sky: 0, end: 0 });
    expect(logoAt(0).opacity).toBe(0);
    expect(wordAt(0).opacity).toBe(0);
    expect(tamilAt(0).opacity).toBe(0);
  });

  it('hits the authored keyframes and interpolates linearly between them', () => {
    // 20% and 22% are keyframes; 21% is halfway between them.
    expect(bigTransformAt(0.2).tx).toBeCloseTo(-1488.1, 3);
    expect(bigTransformAt(0.22).tx).toBeCloseTo(-1541.7, 3);
    expect(bigTransformAt(0.21).tx).toBeCloseTo((-1488.1 + -1541.7) / 2, 3);
    expect(bigTransformAt(0.5).scale).toBeCloseTo(0.3933, 4);
  });

  it('pans steadily left for the first 1.1 s without zooming', () => {
    const early = bigTransformAt(0.05);
    const later = bigTransformAt(0.15);
    expect(later.tx).toBeLessThan(early.tx);
    expect(early.scale).toBe(1);
    expect(later.scale).toBe(1);
  });

  it('crossfades letters to the sky between 22% and 42% (1.3 s to 2.5 s)', () => {
    expect(layersAt(0.22).gradientLetters).toBe(1);
    const middle = layersAt(0.32);
    expect(middle.gradientLetters).toBeCloseTo(0.5, 3);
    expect(middle.darkLetters).toBeCloseTo(0.5, 3);
    expect(layersAt(0.42)).toEqual({ gradientLetters: 0, darkLetters: 1, sky: 1, end: 0 });
  });

  it('fades the sky into the deep end gradient between 50% and 72%', () => {
    expect(layersAt(0.5).sky).toBe(1);
    expect(layersAt(0.72)).toEqual({ gradientLetters: 0, darkLetters: 1, sky: 0, end: 1 });
  });

  it('raises the letter gradient 760 px over 4 s, then holds', () => {
    expect(riseAt(0)).toBe(0);
    expect(riseAt(2 / 6)).toBeCloseTo(380, 3);
    expect(riseAt(4 / 6)).toBeCloseTo(760, 3);
    expect(riseAt(1)).toBe(760);
  });

  it('ends on the final state', () => {
    expect(bigTransformAt(1)).toEqual({ tx: -588, ty: 308.1, scale: 0.27 });
    expect(logoAt(1)).toEqual({ opacity: 1, translateY: 0, scale: 1 });
    expect(wordAt(1)).toEqual({ opacity: 1, scale: 1, letterSpacing: 2, blur: 0 });
    expect(tamilAt(1)).toEqual({ opacity: 1, translateY: 0 });
  });

  it('brings elements in at the designed times', () => {
    // Word 58%-80%, logo 62%-82%, Tamil name 72%-90%.
    expect(wordAt(0.58).opacity).toBe(0);
    expect(wordAt(0.8).opacity).toBe(1);
    expect(logoAt(0.62)).toEqual({ opacity: 0, translateY: 16, scale: 0.86 });
    expect(logoAt(0.82).opacity).toBe(1);
    expect(tamilAt(0.72)).toEqual({ opacity: 0, translateY: 10 });
    expect(tamilAt(0.9).opacity).toBe(1);
  });
});
