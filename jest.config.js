module.exports = {
  preset: '@react-native/jest-preset',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(?:@react-native|react-native|@react-navigation|@shopify/flash-list|@react-native-async-storage)/)',
  ],
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
};
