import { View } from 'react-native';

import { color, radius, type RadiusName } from '../tokens';
import { Icon, type IconName } from './Icon';

const TONES = {
  lavender: { background: color.lavender, foreground: color.purple },
  mango: { background: color.mangoTint, foreground: color.mangoText },
  gold: { background: color.gold, foreground: color.purpleDeep },
  purple: { background: color.purple, foreground: color.white },
  deep: { background: color.purpleDeep, foreground: color.gold },
  onDark: { background: color.onDarkFill, foreground: color.gold },
  // Finished jobs on Bookings (design/source/Bookings.dc.html, Past list).
  neutral: { background: color.neutralTint, foreground: color.muted },
} as const;

export type IconBoxTone = keyof typeof TONES;

export type IconBoxProps = {
  icon: IconName;
  tone: IconBoxTone;
  /** Box width and height. */
  size: number;
  /** Default: iconBox (12). */
  radius?: RadiusName;
  /** Default 20. */
  iconSize?: number;
  /** Default 2. */
  strokeWidth?: number;
};

/** A rounded square with a centred icon, in one of the design's colour pairs. */
export function IconBox({
  icon,
  tone,
  size,
  radius: radiusName = 'iconBox',
  iconSize = 20,
  strokeWidth,
}: IconBoxProps) {
  const t = TONES[tone];
  return (
    <View
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: radius[radiusName],
        backgroundColor: t.background,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon name={icon} size={iconSize} color={t.foreground} strokeWidth={strokeWidth} />
    </View>
  );
}
