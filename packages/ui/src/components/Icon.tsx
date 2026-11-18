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
  // Tracking.dc.html "Call Murugan" and "Message Murugan".
  phone: [
    {
      t: 'path',
      d: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
    },
  ],
  messageSquare: [
    { t: 'path', d: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' },
  ],
  // Searching.dc.html "Job posted" (drawn there with stroke-width 3).
  check: [{ t: 'polyline', points: '20 6 9 17 4 12' }],
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
  camera: [
    {
      t: 'path',
      d: 'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z',
    },
    { t: 'circle', cx: 12, cy: 13, r: 4 },
  ],
  bell: [
    { t: 'path', d: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9' },
    { t: 'path', d: 'M10.3 21a1.94 1.94 0 0 0 3.4 0' },
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
  // Profile.dc.html: Business account, Language, Help and support, Log out.
  building: [
    { t: 'rect', x: 4, y: 2, width: 16, height: 20, rx: 2 },
    line(9, 6, 9, 6.01),
    line(15, 6, 15, 6.01),
    line(9, 10, 9, 10.01),
    line(15, 10, 15, 10.01),
    line(9, 14, 9, 14.01),
    line(15, 14, 15, 14.01),
    { t: 'path', d: 'M10 22v-4h4v4' },
  ],
  globe: [
    { t: 'circle', cx: 12, cy: 12, r: 10 },
    line(2, 12, 22, 12),
    {
      t: 'path',
      d: 'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z',
    },
  ],
  helpCircle: [
    { t: 'circle', cx: 12, cy: 12, r: 10 },
    { t: 'path', d: 'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3' },
    line(12, 17, 12.01, 17),
  ],
  logOut: [
    { t: 'path', d: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' },
    { t: 'polyline', points: '16 17 21 12 16 7' },
    line(21, 12, 9, 12),
  ],
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
  // Settings screens (Language, Safety, Legal, DeleteAccount .dc.html).
  languages: [
    { t: 'path', d: 'm5 8 6 6' },
    { t: 'path', d: 'm4 14 6-6 2-3' },
    { t: 'path', d: 'M2 5h12' },
    { t: 'path', d: 'M7 2h1' },
    { t: 'path', d: 'm22 22-5-10-5 10' },
    { t: 'path', d: 'M14 18h6' },
  ],
  volume: [
    { t: 'polygon', points: '11 5 6 9 2 9 2 15 6 15 11 19 11 5' },
    { t: 'path', d: 'M15.54 8.46a5 5 0 0 1 0 7.07' },
  ],
  type: [{ t: 'polyline', points: '4 7 4 4 20 4 20 7' }, line(9, 20, 15, 20), line(12, 4, 12, 20)],
  plus: [{ t: 'path', d: 'M12 5v14M5 12h14' }],
  users: [
    { t: 'path', d: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' },
    { t: 'circle', cx: 9, cy: 7, r: 4 },
    { t: 'path', d: 'M23 21v-2a4 4 0 0 0-3-3.87' },
    { t: 'path', d: 'M16 3.13a4 4 0 0 1 0 7.75' },
  ],
  scale: [
    { t: 'path', d: 'm16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z' },
    { t: 'path', d: 'm2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z' },
    { t: 'path', d: 'M7 21h10' },
    { t: 'path', d: 'M12 3v18' },
    { t: 'path', d: 'M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2' },
  ],
  idCard: [
    { t: 'rect', x: 2, y: 5, width: 20, height: 14, rx: 2 },
    { t: 'circle', cx: 8, cy: 12, r: 2 },
    line(13, 10, 18, 10),
    line(13, 14, 18, 14),
  ],
  eye: [
    { t: 'path', d: 'M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z' },
    { t: 'circle', cx: 12, cy: 12, r: 3 },
  ],
  clock: [
    { t: 'circle', cx: 12, cy: 12, r: 10 },
    { t: 'polyline', points: '12 6 12 12 16 14' },
  ],
  mail: [
    { t: 'rect', x: 2, y: 4, width: 20, height: 16, rx: 2 },
    { t: 'path', d: 'm22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7' },
  ],
  pencil: [
    { t: 'path', d: 'M12 20h9' },
    { t: 'path', d: 'M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z' },
  ],
  trash: [
    { t: 'polyline', points: '3 6 5 6 21 6' },
    { t: 'path', d: 'M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6' },
  ],
  // Account, job details and search screens (design v3).
  plusLines: [line(12, 5, 12, 19), line(5, 12, 19, 12)],
  x: [line(18, 6, 6, 18), line(6, 6, 18, 18)],
  stop: [{ t: 'rect', x: 6, y: 6, width: 12, height: 12, rx: 2 }],
  play: [{ t: 'polygon', points: '6 3 20 12 6 21 6 3' }],
  image: [
    { t: 'rect', x: 3, y: 3, width: 18, height: 18, rx: 2 },
    { t: 'circle', cx: 9, cy: 9, r: 2 },
    { t: 'path', d: 'm21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21' },
  ],
  locate: [
    line(2, 12, 5, 12),
    line(19, 12, 22, 12),
    line(12, 2, 12, 5),
    line(12, 19, 12, 22),
    { t: 'circle', cx: 12, cy: 12, r: 7 },
    { t: 'circle', cx: 12, cy: 12, r: 3 },
  ],
  lock: [
    { t: 'rect', x: 3, y: 11, width: 18, height: 11, rx: 2 },
    { t: 'path', d: 'M7 11V7a5 5 0 0 1 10 0v4' },
  ],
  paperclip: [
    {
      t: 'path',
      d: 'm21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48',
    },
  ],
  send: [
    { t: 'path', d: 'm22 2-7 20-4-9-9-4Z' },
    { t: 'path', d: 'M22 2 11 13' },
  ],
  bike: [
    { t: 'circle', cx: 18.5, cy: 17.5, r: 3.5 },
    { t: 'circle', cx: 5.5, cy: 17.5, r: 3.5 },
    { t: 'circle', cx: 15, cy: 5, r: 1 },
    { t: 'path', d: 'M12 17.5V14l-3-3 4-3 2 3h2' },
  ],
  car: [
    {
      t: 'path',
      d: 'M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2',
    },
    { t: 'circle', cx: 7, cy: 17, r: 2 },
    { t: 'path', d: 'M9 17h6' },
    { t: 'circle', cx: 17, cy: 17, r: 2 },
  ],
  truck: [
    { t: 'path', d: 'M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2' },
    { t: 'path', d: 'M15 18H9' },
    {
      t: 'path',
      d: 'M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14',
    },
    { t: 'circle', cx: 17, cy: 18, r: 2 },
    { t: 'circle', cx: 7, cy: 18, r: 2 },
  ],
  road: [
    { t: 'path', d: 'M4 19 8 5' },
    { t: 'path', d: 'm16 5 4 14' },
    { t: 'path', d: 'M12 6v2' },
    { t: 'path', d: 'M12 11v2' },
    { t: 'path', d: 'M12 16v2' },
  ],
  lightbulb: [
    {
      t: 'path',
      d: 'M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5',
    },
    { t: 'path', d: 'M9 18h6' },
    { t: 'path', d: 'M10 22h4' },
  ],
  battery: [{ t: 'rect', x: 2, y: 7, width: 16, height: 10, rx: 2 }, line(22, 11, 22, 13)],
  // Worker profile, chat, quotes and tailor screens (design v3).
  bookmark: [{ t: 'path', d: 'm19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z' }],
  graduationCap: [
    { t: 'path', d: 'M22 10v6M2 10l10-5 10 5-10 5z' },
    { t: 'path', d: 'M6 12v5c3 3 9 3 12 0v-5' },
  ],
  phoneOff: [
    {
      t: 'path',
      d: 'M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91',
    },
    line(22, 2, 2, 22),
  ],
  receipt: [
    {
      t: 'path',
      d: 'M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z',
    },
    { t: 'path', d: 'M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8' },
    { t: 'path', d: 'M12 17.5v-11' },
  ],
  store: [
    { t: 'path', d: 'm2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7' },
    { t: 'path', d: 'M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8' },
    { t: 'path', d: 'M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4' },
    { t: 'path', d: 'M2 7h20' },
  ],
  // Housekeeping, crews, handover and receipt screens (design v3).
  repeat: [
    { t: 'path', d: 'm17 2 4 4-4 4' },
    { t: 'path', d: 'M3 11v-1a4 4 0 0 1 4-4h14' },
    { t: 'path', d: 'm7 22-4-4 4-4' },
    { t: 'path', d: 'M21 13v1a4 4 0 0 1-4 4H3' },
  ],
  pause: [
    { t: 'rect', x: 6, y: 4, width: 4, height: 16, rx: 1 },
    { t: 'rect', x: 14, y: 4, width: 4, height: 16, rx: 1 },
  ],
  // Crew.dc.html draws this slightly narrower version of `users`.
  team: [
    { t: 'path', d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' },
    { t: 'circle', cx: 9, cy: 7, r: 4 },
    { t: 'path', d: 'M22 21v-2a4 4 0 0 0-3-3.87' },
    { t: 'path', d: 'M16 3.13a4 4 0 0 1 0 7.75' },
  ],
  // CrewTeam.dc.html "daily payments" (a newer Lucide wallet than `wallet`).
  walletDaily: [
    {
      t: 'path',
      d: 'M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1',
    },
    { t: 'path', d: 'M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4' },
  ],
  package: [
    { t: 'path', d: 'm7.5 4.27 9 5.15' },
    {
      t: 'path',
      d: 'M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z',
    },
    { t: 'path', d: 'm3.3 7 8.7 5 8.7-5' },
    { t: 'path', d: 'M12 22V12' },
  ],
  share: [
    { t: 'circle', cx: 18, cy: 5, r: 3 },
    { t: 'circle', cx: 6, cy: 12, r: 3 },
    { t: 'circle', cx: 18, cy: 19, r: 3 },
    line(8.59, 13.51, 15.42, 17.49),
    line(15.41, 6.51, 8.59, 10.49),
  ],
  // Profile.dc.html Measurements row.
  ruler: [
    {
      t: 'path',
      d: 'M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z',
    },
    { t: 'path', d: 'm14.5 12.5 2-2' },
    { t: 'path', d: 'm11.5 9.5 2-2' },
    { t: 'path', d: 'm8.5 6.5 2-2' },
    { t: 'path', d: 'm17.5 15.5 2-2' },
  ],
  // Main.dc.html Housekeeping tile.
  sparkles: [
    { t: 'path', d: 'M9.94 14.06 12 21l2.06-6.94L21 12l-6.94-2.06L12 3 9.94 9.94 3 12z' },
    { t: 'path', d: 'M20 3v4' },
    { t: 'path', d: 'M22 5h-4' },
  ],
  // System states (NoInternet, ErrorState, EmptyState, UpdateApp .dc.html).
  wifiOff: [
    { t: 'path', d: 'M12 20h.01' },
    { t: 'path', d: 'M8.5 16.43a5 5 0 0 1 7 0' },
    { t: 'path', d: 'M5 12.86a10 10 0 0 1 5.17-2.69' },
    { t: 'path', d: 'M19 12.86a10 10 0 0 0-2.01-1.52' },
    { t: 'path', d: 'M2 8.82a15 15 0 0 1 4.17-2.65' },
    { t: 'path', d: 'M10.66 5c4.01-.36 8.14.9 11.34 3.76' },
    { t: 'path', d: 'm2 2 20 20' },
  ],
  alertCircle: [
    { t: 'circle', cx: 12, cy: 12, r: 10 },
    line(12, 8, 12, 12),
    line(12, 16, 12.01, 16),
  ],
  rotateCcw: [
    { t: 'path', d: 'M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8' },
    { t: 'path', d: 'M3 3v5h5' },
  ],
  // The "Checking…" spinner arc.
  loader: [{ t: 'path', d: 'M21 12a9 9 0 1 1-6.219-8.56' }],
  settings: [
    {
      t: 'path',
      d: 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z',
    },
    { t: 'circle', cx: 12, cy: 12, r: 3 },
  ],
  inbox: [
    { t: 'polyline', points: '22 12 16 12 14 15 10 15 8 12 2 12' },
    {
      t: 'path',
      d: 'M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z',
    },
  ],
  searchX: [
    { t: 'circle', cx: 11, cy: 11, r: 8 },
    { t: 'path', d: 'm21 21-4.3-4.3' },
    { t: 'path', d: 'm8.5 8.5 5 5' },
    { t: 'path', d: 'm13.5 8.5-5 5' },
  ],
  download: [
    { t: 'path', d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' },
    { t: 'polyline', points: '7 10 12 15 17 10' },
    line(12, 15, 12, 3),
  ],
  // Pay.dc.html "Show a QR code instead".
  qrCode: [
    { t: 'rect', x: 3, y: 3, width: 7, height: 7, rx: 1 },
    { t: 'rect', x: 14, y: 3, width: 7, height: 7, rx: 1 },
    { t: 'rect', x: 3, y: 14, width: 7, height: 7, rx: 1 },
    { t: 'path', d: 'M14 14h3v3h-3zM20 14v.01M14 20h.01M17 20h4v-3' },
  ],
  // Pay.dc.html "Paying in cash".
  banknote: [
    { t: 'rect', x: 2, y: 6, width: 20, height: 12, rx: 2 },
    { t: 'circle', cx: 12, cy: 12, r: 2 },
    { t: 'path', d: 'M6 12h.01M18 12h.01' },
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
      // v3 layout rule: icons never shrink. In a row that runs out of space
      // (long Tamil text, large system fonts) flexbox would otherwise squash
      // the icon before wrapping the text.
      style={NO_SHRINK}
      accessible={false}
      importantForAccessibility="no-hide-descendants"
    >
      {shapes.map(renderShape)}
    </Svg>
  );
}

const NO_SHRINK = { flexShrink: 0 } as const;
