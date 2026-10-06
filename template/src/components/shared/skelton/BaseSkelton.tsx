import React, { memo, ReactNode } from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import Skeleton from 'react-native-reanimated-skeleton';
import { useAppTheme } from '@/context/ThemeContext';
import { ICustomViewStyle } from 'react-native-reanimated-skeleton/lib/typescript/constants';

export interface SkeletonLayoutItem {
  key: string;
  width: number;
  height: number;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  borderRadius?: number;
}

export interface SkeletonBaseProps {
  children?: ReactNode;
  isLoading?: boolean;
  layout?: ICustomViewStyle[];
  duration?: number;
  containerStyle?: StyleProp<ViewStyle>;
  boneColor?: string;
  highlightColor?: string;
  animationType?: 'pulse' | 'shiver' | 'none';
  animationDirection?:
    | 'horizontalLeft'
    | 'horizontalRight'
    | 'verticalTop'
    | 'verticalDown'
    | 'diagonalDownLeft'
    | 'diagonalDownRight'
    | 'diagonalTopLeft'
    | 'diagonalTopRight';
}

const BaseSkelton = ({
  children,
  isLoading = false,
  layout,
  duration = 1000,
  containerStyle,
  boneColor,
  highlightColor,
  animationType = 'shiver',
  animationDirection = 'horizontalRight',
}: SkeletonBaseProps) => {
  const { color } = useAppTheme();

  const defaultBoneColor = boneColor ?? color.background_secondary;
  const defaultHighlightColor = highlightColor ?? color.border;

  return (
    <Skeleton
      isLoading={isLoading}
      layout={layout}
      animationType={animationType}
      animationDirection={animationDirection}
      boneColor={defaultBoneColor}
      highlightColor={defaultHighlightColor}
      duration={duration}
      containerStyle={[containerStyle]}
      hasFadeIn={true}
    >
      {children}
    </Skeleton>
  );
};

export default memo(BaseSkelton);
