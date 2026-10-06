import { Dimensions, PixelRatio, Platform } from 'react-native';

export const AppDimensions = {
  screenWidth: Dimensions.get('screen').width,
  screenHeight: Dimensions.get('screen').height,
  windowWidth: Dimensions.get('window').width,
  windowHeight: Dimensions.get('window').height,
  pixelRatio: PixelRatio.get(),
} as const;

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
