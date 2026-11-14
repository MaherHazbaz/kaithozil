import { color } from '@kaithozhil/ui';
import Svg, { Circle, G, Line, Path, Rect } from 'react-native-svg';

export type RouteMapProps = {
  /** Height of the status bar. The drawing continues behind it. */
  topInset: number;
};

/** The design draws the map 390 x 330. */
export const ROUTE_MAP_HEIGHT = 330;

// How far the roads are drawn above the design's top edge, so they carry on
// behind the status bar instead of stopping at it. Taller than any status bar.
const OVERDRAW = 120;

/**
 * The map on Worker on the way (design/source/Tracking.dc.html).
 *
 * This is the design's own drawing, not a live map: four roads, the dotted
 * route, the worker (mango) and the customer's address (purple). A real map
 * with the worker's position replaces it when live tracking is built.
 *
 * The viewBox starts `topInset` above the design's top edge, so everything the
 * design drew stays exactly where it was, measured from the safe area.
 */
export function RouteMap({ topInset }: RouteMapProps) {
  const height = ROUTE_MAP_HEIGHT + topInset;
  return (
    <Svg
      width="100%"
      height={height}
      viewBox={`0 ${-topInset} 390 ${height}`}
      // Fill the width on wider phones and crop the overflow, like CSS
      // `object-fit: cover`.
      preserveAspectRatio="xMidYMid slice"
      accessible={false}
      importantForAccessibility="no-hide-descendants"
    >
      <Rect
        x={0}
        y={-OVERDRAW}
        width={390}
        height={ROUTE_MAP_HEIGHT + OVERDRAW}
        fill={color.mapGround}
      />
      <G stroke={color.white} strokeWidth={14}>
        <Line x1={0} y1={90} x2={390} y2={70} />
        <Line x1={0} y1={230} x2={390} y2={250} />
        {/* The design's lines from y=0 to y=330, extended upwards along the same slope. */}
        <Line x1={110 - (20 / 330) * OVERDRAW} y1={-OVERDRAW} x2={130} y2={330} />
        <Line x1={280 + (20 / 330) * OVERDRAW} y1={-OVERDRAW} x2={260} y2={330} />
      </G>
      <Path
        d="M 92 236 L 124 232 L 120 84 L 268 72 L 266 150"
        fill="none"
        stroke={color.purple}
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="2 10"
      />
      <Circle cx={92} cy={236} r={16} fill={color.mango} stroke={color.white} strokeWidth={4} />
      <Circle cx={266} cy={150} r={12} fill={color.purple} stroke={color.white} strokeWidth={4} />
    </Svg>
  );
}
