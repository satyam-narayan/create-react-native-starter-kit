import { spacing } from '@/theme';
import { normalize } from '@/utils/normalize';
import { ICustomViewStyle } from 'react-native-reanimated-skeleton/lib/typescript/constants';

const AVATAR_SIZE = 150;

/** Matches Home content: title → avatar. */
export const homeShimmerLayout = (): ICustomViewStyle[] => [
  // Title
  {
    key: 'title',
    width: normalize(160),
    height: normalize(24),
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: spacing.md,
  },
  // AvatarPicker
  {
    key: 'avatar',
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    marginTop: spacing.md,
  },
];
