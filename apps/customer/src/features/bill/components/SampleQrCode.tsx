import { color } from '@kaithozhil/ui';
import Svg, { G, Rect } from 'react-native-svg';

// The pattern drawn in Pay.dc.html, one character per 10pt module ('#' dark).
// It is a picture of a QR code, not a scannable one: the real code comes from
// the payment partner for each job and expires (Pay.dc.html: "expires in 10
// minutes"). Replace this component with that image once payments are decided.
const SAMPLE = [
  '####.#..#.#..####',
  '#####.#..#.#.####',
  '####.##...##.####',
  '####.........####',
  '...##...##...##..',
  '#..#.#..#.#..#.#.',
  '.#..#.#..#.#..#.#',
  '##...##...##...##',
  '.................',
  '...##...##...##..',
  '#..#.#..#.#..#.#.',
  '.#..#.#..#.#..#.#',
  '##...##...##...##',
  '####.............',
  '#####...##...##..',
  '####.#..#.#..#.#.',
  '#####.#..#.#..#.#',
] as const;

const MODULE = 10;
const SIZE = SAMPLE.length * MODULE;

const CELLS = SAMPLE.flatMap((row, y) =>
  row.split('').flatMap((cell, x) => (cell === '#' ? [{ x: x * MODULE, y: y * MODULE }] : [])),
);

/** The 170pt QR code on Pay.dc.html (sample pattern). */
export function SampleQrCode({ accessibilityLabel }: { accessibilityLabel: string }) {
  return (
    <Svg
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
    >
      <Rect width={SIZE} height={SIZE} fill={color.white} />
      <G fill={color.ink}>
        {CELLS.map(({ x, y }) => (
          <Rect key={`${x}-${y}`} x={x} y={y} width={MODULE} height={MODULE} />
        ))}
      </G>
    </Svg>
  );
}
