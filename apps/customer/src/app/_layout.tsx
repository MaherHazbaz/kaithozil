import { color } from '@kaithozhil/ui';
import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Root layout. With Expo Router, every file in src/app is a route and this file
// wraps all of them (like a root layout in Next.js).
//
// Fonts need no loading code here: they are embedded in the native app by the
// expo-font config plugin (see packages/ui/fonts.config.js), so they exist
// before the first screen renders and the native splash hands over cleanly.
export default function RootLayout() {
  return (
    // Required once at the root for react-native-gesture-handler.
    <GestureHandlerRootView style={styles.root}>
      <Stack
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
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
