// Font files for the expo-font config plugin (read by each app's app.config.ts).
//
// WHY a config plugin instead of loading fonts at runtime with useFonts():
// the plugin copies the files into the native project at build time, so the
// fonts exist before the first screen renders. There is no "flash of fallback
// font" and nothing to await while the native splash screen is showing.
//
// On Android each family is registered as an XML font family, which lets
// screens write `fontFamily: 'Plus Jakarta Sans', fontWeight: '800'` exactly
// like CSS. The family names here must match src/theme/fonts.ts.
//
// This file is plain CommonJS because it runs in Node during `expo prebuild`,
// not inside the app bundle.

/** @param {string} id */
const file = (id) => require.resolve(id);

const jakarta = (name) =>
  file(`@expo-google-fonts/plus-jakarta-sans/${name}/PlusJakartaSans_${name}.ttf`);
const tamil = (name) =>
  file(`@expo-google-fonts/noto-sans-tamil/${name}/NotoSansTamil_${name}.ttf`);

// Weights are exactly the ones the design loads (design/DESIGN.md, "Fonts").
const families = [
  {
    fontFamily: 'Plus Jakarta Sans',
    fontDefinitions: [
      { path: jakarta('400Regular'), weight: 400 },
      { path: jakarta('500Medium'), weight: 500 },
      { path: jakarta('600SemiBold'), weight: 600 },
      { path: jakarta('700Bold'), weight: 700 },
      { path: jakarta('800ExtraBold'), weight: 800 },
    ],
  },
  {
    fontFamily: 'Noto Sans Tamil',
    fontDefinitions: [
      { path: tamil('400Regular'), weight: 400 },
      { path: tamil('600SemiBold'), weight: 600 },
      { path: tamil('700Bold'), weight: 700 },
    ],
  },
  {
    fontFamily: 'Anton',
    fontDefinitions: [
      { path: file('@expo-google-fonts/anton/400Regular/Anton_400Regular.ttf'), weight: 400 },
    ],
  },
  {
    // Used once: the "Kaithozhil" title on Welcome (design/source/Welcome.dc.html).
    fontFamily: 'Bebas Neue',
    fontDefinitions: [
      {
        path: file('@expo-google-fonts/bebas-neue/400Regular/BebasNeue_400Regular.ttf'),
        weight: 400,
      },
    ],
  },
];

module.exports = {
  /** Android: named families with per-weight files. */
  androidFonts: families,
  /** iOS: plain file list; iOS reads the family name from each file. */
  iosFonts: families.flatMap((family) => family.fontDefinitions.map((def) => def.path)),
};
