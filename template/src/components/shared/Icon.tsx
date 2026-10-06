import { IconName, Icons } from '@/assets/icons';
import React from 'react';
import { SvgProps } from 'react-native-svg';

export interface IconProps extends SvgProps {
  name: IconName;
  size?: number;
  color?: string;
}

const Icon = ({ name, size = 24, color, ...props }: IconProps) => {
  const Component = Icons[name];

  if (!Component) {
    return null;
  }

  return (
    <Component
      width={size}
      height={size}
      {...(color ? { fill: color } : {})}
      {...props}
    />
  );
};

export default Icon;
