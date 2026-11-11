// Raw font files for code that draws text itself instead of using <Text>.
//
// WHY: Skia (used for the opening animation) draws on its own canvas and cannot
// see the fonts registered with the operating system, so it needs the font FILE.
// `require` of a .ttf returns an asset id that Metro (React Native's bundler)
// resolves at build time.

export const antonFontAsset =
  require('@expo-google-fonts/anton/400Regular/Anton_400Regular.ttf') as number;
