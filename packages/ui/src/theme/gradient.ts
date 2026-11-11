export type Point = { x: number; y: number };
export type GradientPoints = { start: Point; end: Point };

/**
 * Converts a CSS `linear-gradient(<angle>)` to the start/end points that
 * expo-linear-gradient needs, for a box of the given size.
 *
 * WHY this needs the box size: in CSS the gradient line passes through the
 * centre of the box at the given angle, and its LENGTH is chosen so the first
 * and last colours land exactly in the corners. That length depends on the
 * box's width and height, so the same 160deg gradient has different end points
 * on a wide button than on a tall header. Fixed points would be subtly wrong.
 *
 * CSS angles: 0deg points up, 90deg points right, and they grow clockwise.
 * The returned points are fractions of the box (0..1), and may fall outside
 * that range, which expo-linear-gradient supports.
 *
 * Spec: https://www.w3.org/TR/css-images-3/#linear-gradients
 */
export function cssAngleToPoints(angleDeg: number, width: number, height: number): GradientPoints {
  if (!(width > 0) || !(height > 0)) {
    // Not laid out yet: fall back to a plain top-to-bottom gradient.
    return { start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } };
  }

  const angle = (angleDeg * Math.PI) / 180;
  const sin = Math.sin(angle);
  const cos = Math.cos(angle);

  // Length of the gradient line, from the CSS spec.
  const length = Math.abs(width * sin) + Math.abs(height * cos);

  // Half the line, as a fraction of the box. Screen y grows downward, so
  // "up" (cos > 0) is a negative y direction.
  const dx = (sin * length) / 2 / width;
  const dy = (-cos * length) / 2 / height;

  return {
    start: { x: 0.5 - dx, y: 0.5 - dy },
    end: { x: 0.5 + dx, y: 0.5 + dy },
  };
}
