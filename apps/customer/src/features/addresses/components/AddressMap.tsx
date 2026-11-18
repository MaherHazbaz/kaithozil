import { color } from '@kaithozhil/ui';
import Svg, { Circle, G, Line, Rect } from 'react-native-svg';

export type AddressMapProps = {
  /** Height of the status bar. The drawing continues behind it. */
  topInset: number;
};

/** The design draws the map 390 x 250. */
export const ADDRESS_MAP_HEIGHT = 250;

// How far the roads are drawn above the design's top edge, so they carry on
// behind the status bar instead of stopping at it. Taller than any status bar.
const OVERDRAW = 120;
// The two north-south roads lean 20 across the drawing's 250 height.
const LEAN = (20 / ADDRESS_MAP_HEIGHT) * OVERDRAW;

/**
 * The map on Add or edit address (design/source/AddressEdit.dc.html).
 *
 * This is the design's own drawing, not a live map: four roads, five blocks
 * and a soft circle where the pin points. A real, movable map replaces it when
 * react-native-maps is added. Same approach as job/components/RouteMap.tsx:
 * the viewBox starts `topInset` above the design's top edge, so everything
 * stays where the design put it, measured from the safe area.
 */
export function AddressMap({ topInset }: AddressMapProps) {
  const height = ADDRESS_MAP_HEIGHT + topInset;
  return (
    <Svg
      width="100%"
      height={height}
      viewBox={`0 ${-topInset} 390 ${height}`}
      // Fill the width on wider phones and crop the overflow, like CSS `slice`.
      preserveAspectRatio="xMidYMid slice"
      accessible={false}
      importantForAccessibility="no-hide-descendants"
    >
      <Rect
        x={0}
        y={-OVERDRAW}
        width={390}
        height={ADDRESS_MAP_HEIGHT + OVERDRAW}
        fill={color.mapGround}
      />
      <G stroke={color.white} strokeWidth={14}>
        <Line x1={0} y1={70} x2={390} y2={55} />
        <Line x1={0} y1={180} x2={390} y2={195} />
        {/* The design's lines from y=0 to y=250, extended upwards along the same slope. */}
        <Line x1={95 - LEAN} y1={-OVERDRAW} x2={115} y2={250} />
        <Line x1={290 + LEAN} y1={-OVERDRAW} x2={270} y2={250} />
      </G>
      <G fill={color.mapBlock}>
        <Rect x={130} y={85} width={50} height={40} rx={4} />
        <Rect x={200} y={80} width={55} height={45} rx={4} />
        <Rect x={135} y={140} width={45} height={30} rx={4} />
        <Rect x={300} y={90} width={60} height={70} rx={4} />
        <Rect x={15} y={90} width={65} height={70} rx={4} />
      </G>
      <Circle cx={195} cy={150} r={22} fill={color.purple} fillOpacity={0.15} />
    </Svg>
  );
}
