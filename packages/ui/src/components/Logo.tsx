import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { radius, shadow, type RadiusName, type ShadowName } from '../tokens';

// expo-image (instead of React Native's Image) decodes off the main thread and
// caches the result, which matters once lists show many images.

const LOGO = require('../../assets/logo.png') as number;

export type LogoProps = {
  /** Width and height in points. */
  size: number;
  radius: RadiusName;
  shadow: ShadowName;
};

/** The Kaithozhil logo (design/assets/logo.png) with rounded corners and a shadow. */
export function Logo({ size, radius: radiusName, shadow: shadowName }: LogoProps) {
  const corner = radius[radiusName];
  return (
    // The shadow lives on a wrapper because the image itself clips to its
    // rounded corners, and a clipped view cannot show a shadow outside itself.
    <View
      style={{ width: size, height: size, borderRadius: corner, boxShadow: shadow[shadowName] }}
    >
      <Image
        source={LOGO}
        contentFit="cover"
        accessibilityLabel="Kaithozhil logo"
        style={[styles.image, { borderRadius: corner }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  image: { width: '100%', height: '100%' },
});
