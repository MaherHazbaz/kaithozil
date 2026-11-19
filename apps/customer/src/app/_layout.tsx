import { color } from '@kaithozhil/ui';
import Constants from 'expo-constants';
import { Stack, usePathname } from 'expo-router';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { SystemGate } from '@/features/system/components/SystemGate';
import { ScreenErrorBoundary } from '@/features/system/screens/ScreenErrorBoundary';

// This build's version from app.config.ts, compared with the server's minimum.
const APP_VERSION = Constants.expoConfig?.version;

// Root layout. With Expo Router, every file in src/app is a route and this file
// wraps all of them (like a root layout in Next.js).
//
// Fonts need no loading code here: they are embedded in the native app by the
// expo-font config plugin (see packages/ui/fonts.config.js), so they exist
// before the first screen renders and the native splash hands over cleanly.
export default function RootLayout() {
  const pathname = usePathname();
  return (
    // Required once at the root for react-native-gesture-handler.
    <GestureHandlerRootView style={styles.root}>
      {/* No internet, Under maintenance and Update required cover the app when
          needed. The opening animation always plays first. */}
      <SystemGate currentVersion={APP_VERSION} paused={pathname === '/'}>
        <Stack
          // A screen that crashes shows Something went wrong instead of closing
          // the app. Each screen gets its own boundary, so Back and "Go home"
          // still work. The prop is marked unstable in Expo Router 58; the
          // stable alternative is an `ErrorBoundary` export in every route file.
          unstable_screenErrorBoundary={ScreenErrorBoundary}
          screenOptions={{
            // Screens draw their own headers, exactly as designed.
            headerShown: false,
            contentStyle: { backgroundColor: color.pageBackground },
          }}
        >
          {/* The opening animation fades into Welcome instead of sliding. */}
          <Stack.Screen
            name="index"
            options={{ animation: 'fade', contentStyle: { backgroundColor: color.purpleBlack } }}
          />
          <Stack.Screen name="welcome" options={{ animation: 'fade' }} />
          <Stack.Screen name="login" />
          <Stack.Screen name="home" options={{ animation: 'fade' }} />
          {/* Tab screens fade into each other; a slide would suggest going deeper. */}
          <Stack.Screen name="bookings" options={{ animation: 'fade' }} />
          <Stack.Screen name="profile" options={{ animation: 'fade' }} />
        </Stack>
      </SystemGate>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
