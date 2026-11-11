import type { ConfigContext, ExpoConfig } from 'expo/config';

// Font files live in packages/ui so both apps embed the same set.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { androidFonts, iosFonts } = require('@kaithozhil/ui/fonts.config.js') as {
  androidFonts: object[];
  iosFonts: string[];
};

// One codebase, three installable apps. Each variant has its own package id so
// development, preview (staging) and production builds can sit side by side on
// one phone and never share data. Backend projects per variant come in Sprint 2.
const VARIANTS = {
  development: {
    name: 'Kaithozhil (Dev)',
    id: 'in.kaithozhil.customer.dev',
    scheme: 'kaithozhil-dev',
  },
  preview: {
    name: 'Kaithozhil (Preview)',
    id: 'in.kaithozhil.customer.preview',
    scheme: 'kaithozhil-preview',
  },
  production: {
    name: 'Kaithozhil',
    id: 'in.kaithozhil.customer',
    scheme: 'kaithozhil',
  },
} as const;

type Variant = keyof typeof VARIANTS;

function resolveVariant(): Variant {
  const raw = process.env.APP_VARIANT ?? 'development';
  if (raw in VARIANTS) {
    return raw as Variant;
  }
  // Fail the build loudly: a typo must never silently produce a production app.
  throw new Error(
    `APP_VARIANT="${raw}" is not valid. Use one of: ${Object.keys(VARIANTS).join(', ')}.`,
  );
}

export default ({ config }: ConfigContext): ExpoConfig => {
  const variant = VARIANTS[resolveVariant()];

  return {
    ...config,
    name: variant.name,
    slug: 'kaithozhil-customer',
    version: '0.1.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    scheme: variant.scheme,
    // The approved design is light-only; do not let the system dark theme
    // restyle native surfaces (keyboard, dialogs) behind it.
    userInterfaceStyle: 'light',
    ios: {
      bundleIdentifier: variant.id,
    },
    android: {
      package: variant.id,
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon-foreground.png',
        // The logo's own background colour, sampled by scripts/make-assets.mjs.
        backgroundColor: '#FDFAEC',
      },
      predictiveBackGestureEnabled: false,
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          // Same colour as the first frame of the opening animation
          // (design/source/Splash.dc.html), so the hand-over from the native
          // splash to the animated one is invisible. The image is a transparent
          // pixel: the animation, not a static logo, is the brand moment.
          backgroundColor: '#0D0420',
          image: './assets/splash-blank.png',
          imageWidth: 1,
        },
      ],
      ['expo-font', { android: { fonts: androidFonts }, ios: { fonts: iosFonts } }],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
  };
};
