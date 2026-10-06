import AnimatedTabIcon from './AnimatedTabIcon';

interface RenderTabIconProps {
  focused: boolean;
  size: number;
}

export const renderHomeIcon = (props: RenderTabIconProps) => (
  <AnimatedTabIcon {...props} name="home" />
);

export const renderProfileIcon = (props: RenderTabIconProps) => (
  <AnimatedTabIcon {...props} name="profile" />
);
