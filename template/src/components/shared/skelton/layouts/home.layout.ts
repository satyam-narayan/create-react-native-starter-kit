import { spacing } from '@/theme';
import { ICustomViewStyle } from 'react-native-reanimated-skeleton/lib/typescript/constants';

const AVATAR_SIZE = 150;

/** Matches Home content: the centered AvatarPicker (the title is rendered outside the boundary). */
export const homeShimmerLayout = (): ICustomViewStyle[] => [
  {
    key: 'avatar',
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    alignSelf: 'center',
    marginTop: spacing.md,
  },
];
