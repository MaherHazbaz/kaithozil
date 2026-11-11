import { useLocalSearchParams, useRouter } from 'expo-router';

import { SplashScreen } from '@/features/start/screens/SplashScreen';

// Route "/": the opening animation. Route files stay thin: they read
// navigation state and hand callbacks to a feature screen.
export default function SplashRoute() {
  const router = useRouter();
  // Development only: `/?t=3.5` freezes the animation at 3.5 s so a frame can
  // be compared with design/screenshots/Splash_frame_3.5s.png.
  const { t } = useLocalSearchParams<{ t?: string }>();
  const frozenAtSeconds = __DEV__ && t !== undefined ? Number(t) : undefined;

  return (
    <SplashScreen
      // `replace` removes the splash from history, so Back never returns to it.
      onDone={() => router.replace('/welcome')}
      frozenAtSeconds={Number.isFinite(frozenAtSeconds) ? frozenAtSeconds : undefined}
    />
  );
}
