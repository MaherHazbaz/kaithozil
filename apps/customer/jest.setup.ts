// Runs before each test file.

// Reanimated's test mode: animations resolve instantly and shared values work
// in plain JavaScript (there is no UI thread in Jest).
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('react-native-reanimated').setUpTests();

// Gesture Handler connects itself to the UI thread shortly after it loads, by
// asking react-native-worklets for it. Jest has no UI thread: the plain
// JavaScript worklets that Jest loads throw instead, after the tests have
// finished, which fails the whole file. Gesture Handler's own jestSetup does
// not cover this, so that one function returns an empty object here.
jest.mock('react-native-worklets', () => ({
  ...jest.requireActual('react-native-worklets'),
  getUIRuntimeHolder: () => ({}),
}));

// The Skia canvas needs a real GPU surface, which Jest does not have. Tests
// replace the drawn part of the splash with an empty component and exercise
// the timing and navigation logic around it.
jest.mock('@/features/start/components/SplashCanvas', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { useEffect } = require('react');
  return {
    SplashCanvas: ({ onReady }: { onReady: () => void }) => {
      useEffect(() => {
        onReady();
      }, [onReady]);
      return null;
    },
  };
});
