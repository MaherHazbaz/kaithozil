import { cssAngleToPoints } from './gradient';

const close = (actual: number, expected: number) => expect(actual).toBeCloseTo(expected, 4);

describe('cssAngleToPoints', () => {
  it('180deg runs top to bottom whatever the box shape', () => {
    for (const [w, h] of [
      [390, 844],
      [350, 56],
    ] as const) {
      const { start, end } = cssAngleToPoints(180, w, h);
      close(start.x, 0.5);
      close(start.y, 0);
      close(end.x, 0.5);
      close(end.y, 1);
    }
  });

  it('90deg runs left to right', () => {
    const { start, end } = cssAngleToPoints(90, 200, 58);
    close(start.x, 0);
    close(start.y, 0.5);
    close(end.x, 1);
    close(end.y, 0.5);
  });

  it('135deg on a square runs corner to corner', () => {
    const { start, end } = cssAngleToPoints(135, 52, 52);
    close(start.x, 0);
    close(start.y, 0);
    close(end.x, 1);
    close(end.y, 1);
  });

  it('135deg on a wide button reaches past the box, as CSS does', () => {
    // 350 x 56 button: the CSS gradient line is |350 sin| + |56 cos| = 287.09 long.
    const { start, end } = cssAngleToPoints(135, 350, 56);
    close(start.x, 0.5 - (Math.SQRT1_2 * 287.0854) / 2 / 350);
    close(start.y, 0.5 - (Math.SQRT1_2 * 287.0854) / 2 / 56);
    // The end point mirrors the start point through the centre.
    close(start.x + end.x, 1);
    close(start.y + end.y, 1);
    expect(start.y).toBeLessThan(0);
    expect(end.y).toBeGreaterThan(1);
  });

  it('160deg points down and slightly right (the hero gradient)', () => {
    const { start, end } = cssAngleToPoints(160, 390, 300);
    expect(end.y).toBeGreaterThan(start.y);
    expect(end.x).toBeGreaterThan(start.x);
    // The first colour must land exactly in the top-left corner region: the
    // corner projects onto the start of the gradient line.
    const angle = (160 * Math.PI) / 180;
    const dir = { x: Math.sin(angle), y: -Math.cos(angle) };
    const startPx = { x: start.x * 390, y: start.y * 300 };
    const cornerProjection = (0 - startPx.x) * dir.x + (0 - startPx.y) * dir.y;
    close(cornerProjection, 0);
  });

  it('falls back to top-to-bottom before layout (zero size)', () => {
    expect(cssAngleToPoints(160, 0, 0)).toEqual({
      start: { x: 0.5, y: 0 },
      end: { x: 0.5, y: 1 },
    });
  });
});
