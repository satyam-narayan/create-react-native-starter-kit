/**
 * Curated list of starter dependencies and devDependencies.
 * No hardcoded version numbers - package manager (yarn/npm) dynamically
 * installs the latest compatible versions directly from the npm registry.
 */

const STARTER_DEPENDENCIES = [
  '@bam.tech/react-native-image-resizer',
  '@d11/react-native-fast-image',
  '@gorhom/bottom-sheet',
  '@hookform/resolvers',
  '@mhpdev/react-native-haptics',
  '@react-native-community/datetimepicker',
  '@react-native-community/netinfo',
  '@react-native-documents/picker',
  '@react-navigation/bottom-tabs',
  '@react-navigation/native',
  '@react-navigation/native-stack',
  '@reduxjs/toolkit',
  '@tanstack/react-query',
  'axios',
  'i18next',
  'moment',
  'react-hook-form',
  'react-i18next',
  'react-native-element-dropdown',
  'react-native-gesture-handler',
  'react-native-image-picker',
  'rn-international-phone-number',
  'react-native-linear-gradient',
  'react-native-mmkv',
  'react-native-nitro-modules',
  'react-native-reanimated',
  'react-native-reanimated-skeleton',
  'react-native-safe-area-context',
  'react-native-screens',
  'react-native-svg',
  'react-native-toast-message',
  'react-native-walkthrough-tooltip',
  'react-native-worklets',
  'react-redux',
  'redux-persist',
  'yup',
];

const STARTER_DEV_DEPENDENCIES = [
  'babel-plugin-module-resolver',
  'babel-plugin-transform-inline-environment-variables',
  'dotenv',
  'react-native-svg-transformer',
  'react-native-asset',
  'patch-package',
];

module.exports = {
  STARTER_DEPENDENCIES,
  STARTER_DEV_DEPENDENCIES,
};
