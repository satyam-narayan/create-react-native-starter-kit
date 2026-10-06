import { AppDimensions } from '@/constants/device';
import { PixelRatio } from 'react-native';

const BASE_WIDTH = 375;
const MAX_SCALE = 1.2;

export const normalize = (size: number) => {
  const scale = Math.min(AppDimensions.windowWidth / BASE_WIDTH, MAX_SCALE);
  const newSize = size * scale;

  return PixelRatio.roundToNearestPixel(newSize);
};
