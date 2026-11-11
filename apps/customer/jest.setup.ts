// Runs before each test file.

// Reanimated's test mode: animations resolve instantly and shared values work
// in plain JavaScript (there is no UI thread in Jest).
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('react-native-reanimated').setUpTests();

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
