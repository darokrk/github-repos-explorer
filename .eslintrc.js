module.exports = {
  root: true,
  extends: ['@react-native', 'eslint-config-prettier'],
  ignorePatterns: ['node_modules/', 'android/', 'ios/', 'coverage/'],
  rules: {
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-void': ['error', { allowAsStatement: true }],
    'react-native/no-inline-styles': 'error',
  },
};
