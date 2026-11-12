import Svg, { Circle, Line, Path, Polygon, Polyline, Rect } from 'react-native-svg';

import { color as colors } from '../tokens';

// Icon geometry copied exactly from the inline SVGs in design/source/*.dc.html
// (24x24 viewBox, round caps and joins).
//
// WHY not lucide-react-native: the design was drawn with an older Lucide
// release, and several glyphs (home, calendar, scissors, wallet, brick wall)
// have since been redrawn. Rendering the design's own paths guarantees the
// icons match the approved design exactly.
type Shape =
  | { t: 'path'; d: string }
  | { t: 'circle'; cx: number; cy: number; r: number }
  | { t: 'line'; x1: number; y1: number; x2: number; y2: number }
  | { t: 'polyline'; points: string }
  | { t: 'polygon'; points: string }
  | { t: 'rect'; x: number; y: number; width: number; height: number; rx?: number };

const line = (x1: number, y1: number, x2: number, y2: number): Shape => ({
  t: 'line',
  x1,
  y1,
  x2,
  y2,
});

const BADGE_CHECK: Shape[] = [
  {
    t: 'path',
    d: 'M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z',
  },
  { t: 'path', d: 'm9 12 2 2 4-4' },
];

const ICONS = {
  search: [{ t: 'circle', cx: 11, cy: 11, r: 8 }, line(21, 21, 16.65, 16.65)],
  wrench: [
    {
      t: 'path',
      d: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
    },
  ],
  chevronRight: [{ t: 'polyline', points: '9 18 15 12 9 6' }],
  chevronLeft: [{ t: 'polyline', points: '15 18 9 12 15 6' }],
  mapPin: [
    { t: 'path', d: 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z' },
    { t: 'circle', cx: 12, cy: 10, r: 3 },
  ],
  mic: [
    { t: 'path', d: 'M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z' },
    { t: 'path', d: 'M19 10v2a7 7 0 0 1-14 0v-2' },
    line(12, 19, 12, 22),
  ],
  zap: [{ t: 'polygon', points: '13 2 3 14 12 14 11 22 21 10 12 10 13 2' }],
  droplet: [
    {
      t: 'path',
      d: 'M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z',
    },
  ],
  snowflake: [
    line(2, 12, 22, 12),
    line(12, 2, 12, 22),
    { t: 'path', d: 'm20 16-4-4 4-4' },
    { t: 'path', d: 'm4 8 4 4-4 4' },
    { t: 'path', d: 'm16 4-4 4-4-4' },
    { t: 'path', d: 'm8 20 4-4 4 4' },
  ],
  scissors: [
    { t: 'circle', cx: 6, cy: 6, r: 3 },
    { t: 'circle', cx: 6, cy: 18, r: 3 },
    line(20, 4, 8.12, 15.88),
    line(14.47, 14.48, 20, 20),
    line(8.12, 8.12, 12, 12),
  ],
  paintRoller: [
    { t: 'rect', x: 2, y: 2, width: 16, height: 6, rx: 2 },
    { t: 'path', d: 'M10 16v-2a2 2 0 0 1 2-2h8a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2' },
    { t: 'rect', x: 8, y: 16, width: 4, height: 6, rx: 1 },
  ],
  // NOT from the design: faucet (Plumber) and sofa (Carpenter) were chosen by
  // the owner (docs/decisions/0004-service-tile-changes.md). Copied verbatim
  // from current Lucide (lucide-icons/lucide, icons/<name>.svg, ISC licence).
  faucet: [
    { t: 'path', d: 'M10.083 5.428 5.57 4.083a2 2 0 10.001 3.834l4.512-1.345' },
    { t: 'path', d: 'M12 8v3' },
    { t: 'path', d: 'm13.917 5.428 4.511-1.345a2 2 0 110 3.834l-4.51-1.345' },
    { t: 'path', d: 'M18 17v-4.006' },
    { t: 'path', d: 'M22 11v8' },
    {
      t: 'path',
      d: 'M22 12h-3a1 1 0 00-1 .994h-2.539a4 4 0 00-6.915-.012L7 13a5 5 0 00-5 5v1a1 1 0 001 1h2a1 1 0 001-1v-1a1 1 0 01.995-1l1.552.018a4 4 0 006.907 0L18 17a1 1 0 001 1h3',
    },
    { t: 'circle', cx: 12, cy: 6, r: 2 },
  ],
  sofa: [
    { t: 'path', d: 'M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3' },
    {
      t: 'path',
      d: 'M2 16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z',
    },
    { t: 'path', d: 'M4 18v2' },
    { t: 'path', d: 'M20 18v2' },
    { t: 'path', d: 'M12 4v9' },
  ],
  badgeCheck: BADGE_CHECK,
  wallet: [
    { t: 'path', d: 'M21 12V7H5a2 2 0 0 1 0-4h14v4' },
    { t: 'path', d: 'M3 5v14a2 2 0 0 0 2 2h16v-5' },
    { t: 'path', d: 'M18 12a2 2 0 0 0 0 4h4v-4Z' },
  ],
  file: [
    { t: 'path', d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' },
    { t: 'polyline', points: '14 2 14 8 20 8' },
  ],
  shield: [{ t: 'path', d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' }],
  brickWall: [
    { t: 'rect', x: 3, y: 5, width: 18, height: 14, rx: 1 },
    line(3, 9.7, 21, 9.7),
    line(3, 14.3, 21, 14.3),
    line(12, 5, 12, 9.7),
    line(8, 9.7, 8, 14.3),
    line(16, 9.7, 16, 14.3),
    line(12, 14.3, 12, 19),
  ],
  home: [
    { t: 'path', d: 'm3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
    { t: 'polyline', points: '9 22 9 12 15 12 15 22' },
  ],
  calendar: [
    { t: 'rect', x: 3, y: 4, width: 18, height: 18, rx: 2 },
    line(16, 2, 16, 6),
    line(8, 2, 8, 6),
    line(3, 10, 21, 10),
  ],
  user: [
    { t: 'path', d: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' },
    { t: 'circle', cx: 12, cy: 7, r: 4 },
  ],
} satisfies Record<string, Shape[]>;

export type IconName = keyof typeof ICONS;

export type IconProps = {
  name: IconName;
  /** Rendered width and height. Default 24. */
  size?: number;
  /** Stroke colour. Default: ink. */
  color?: string;
  /** Default 2, as in the design. */
  strokeWidth?: number;
};

function renderShape(shape: Shape, key: number) {
  switch (shape.t) {
    case 'path':
      return <Path key={key} d={shape.d} />;
    case 'circle':
      return <Circle key={key} cx={shape.cx} cy={shape.cy} r={shape.r} />;
    case 'line':
      return <Line key={key} x1={shape.x1} y1={shape.y1} x2={shape.x2} y2={shape.y2} />;
    case 'polyline':
      return <Polyline key={key} points={shape.points} />;
    case 'polygon':
      return <Polygon key={key} points={shape.points} />;
    case 'rect':
      return (
        <Rect
          key={key}
          x={shape.x}
          y={shape.y}
          width={shape.width}
          height={shape.height}
          rx={shape.rx}
        />
      );
  }
}

/**
 * A decorative stroke icon. It is hidden from screen readers: the control that
 * contains it carries the accessibilityLabel.
 */
export function Icon({ name, size = 24, color = colors.ink, strokeWidth = 2 }: IconProps) {
  const shapes: Shape[] = ICONS[name];
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      accessible={false}
      importantForAccessibility="no-hide-descendants"
    >
      {shapes.map(renderShape)}
    </Svg>
  );
}
