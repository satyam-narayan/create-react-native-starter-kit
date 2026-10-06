import { ICustomViewStyle } from 'react-native-reanimated-skeleton/lib/typescript/constants';

interface TextProps {
  width?: number;
  height?: number;
}

export const textLayout = ({ width = 100, height = 40 }: TextProps) => {
  const layout: ICustomViewStyle[] = [
    {
      width: width,
      height: height,
      borderRadius: 50,
    },
  ];

  return layout;
};
