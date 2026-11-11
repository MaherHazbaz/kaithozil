/** @type {import('jest').Config} */
module.exports = {
  // jest-expo sets up Babel for TypeScript/JSX and mocks React Native's native side.
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  // Reanimated (and react-native-worklets under it) normally call native code
  // that does not exist in Jest. This resolver, shipped by Reanimated, makes
  // Jest load their plain-JavaScript implementations instead.
  resolver: 'react-native-reanimated/jest/resolver',
  moduleNameMapper: {
    // Same "@/..." alias as tsconfig.json.
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
};
