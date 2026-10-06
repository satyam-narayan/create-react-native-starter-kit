import { ICustomViewStyle } from 'react-native-reanimated-skeleton/lib/typescript/constants';

interface AvatarProps {
  size?: number;
}

export const avatarPickerLayout = ({ size = 100 }: AvatarProps) => {
  const layout: ICustomViewStyle[] = [
    {
      key: 'avatar',
      width: size,
      height: size,
      borderRadius: size / 2,
    },
  ];

  return layout;
};
