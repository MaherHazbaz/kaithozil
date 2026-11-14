import { render } from '@testing-library/react-native';
import type { ReactElement } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// A 390 x 844 screen with typical Android insets, so screens that call
// useSafeAreaInsets() render in tests the way they do on a phone.
const METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 24, left: 0, right: 0, bottom: 16 },
};

/** Renders a screen inside the providers it expects at runtime (see src/app/_layout.tsx). */
export function renderScreen(ui: ReactElement) {
  return render(
    <GestureHandlerRootView>
      <SafeAreaProvider initialMetrics={METRICS}>{ui}</SafeAreaProvider>
    </GestureHandlerRootView>,
  );
}
