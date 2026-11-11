import { StyleSheet } from 'react-native';
import Svg, { G, Polygon, Rect } from 'react-native-svg';

import { color } from '../tokens';

/**
 * The faint city-and-temple skyline along the bottom of the hero header.
 * Shapes copied from design/source/Main.dc.html (viewBox 390 x 70).
 *
 * `preserveAspectRatio="none"` stretches it to the header's width, exactly as
 * the design's SVG does, so it spans the screen from 360 to 430pt wide.
 */
export function Skyline() {
  return (
    <Svg
      width="100%"
      height={70}
      viewBox="0 0 390 70"
      preserveAspectRatio="none"
      style={styles.skyline}
      accessible={false}
      importantForAccessibility="no-hide-descendants"
    >
      <G fill={color.skyline}>
        <Rect x={0} y={40} width={40} height={30} />
        <Rect x={44} y={26} width={30} height={44} />
        <Polygon points="86,70 92,22 116,22 122,70" />
        <Polygon points="92,22 96,10 112,10 116,22" />
        <Polygon points="96,10 100,2 108,2 112,10" />
        <Rect x={132} y={34} width={46} height={36} />
        <Rect x={186} y={18} width={26} height={52} />
        <Rect x={220} y={38} width={40} height={32} />
        <Polygon points="272,70 278,26 302,26 308,70" />
        <Polygon points="278,26 282,14 298,14 302,26" />
        <Rect x={318} y={30} width={34} height={40} />
        <Rect x={356} y={44} width={34} height={26} />
      </G>
    </Svg>
  );
}

const styles = StyleSheet.create({
  skyline: {
    position: 'absolute',
    left: 0,
    bottom: 0,
  },
});
