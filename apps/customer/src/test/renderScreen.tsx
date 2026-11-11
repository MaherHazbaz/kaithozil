import { render } from '@testing-library/react-native';
import type { ReactElement } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// A 390 x 844 screen with typical Android insets, so screens that call
// useSafeAreaInsets() render in tests the way they do on a phone.
const METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 24, left: 0, right: 0, bottom: 16 },
};

/** Renders a screen inside the providers it expects at runtime. */
export function renderScreen(ui: ReactElement) {
  return render(<SafeAreaProvider initialMetrics={METRICS}>{ui}</SafeAreaProvider>);
}
