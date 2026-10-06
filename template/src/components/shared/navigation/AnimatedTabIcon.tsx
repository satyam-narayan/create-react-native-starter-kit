import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { TabIconName, TabIcons } from '@/assets/icons/tabs';
import { useAppTheme } from '@/context/ThemeContext';
import { useColorScheme } from 'react-native';

interface Props {
  focused: boolean;
  size?: number;
  name: TabIconName;
}

const AnimatedTabIcon = ({ focused, name, size = 22 }: Props) => {
  const { mode } = useAppTheme();
  const systemScheme = useColorScheme();
  const resolved: 'light' | 'dark' =
    mode === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : mode;
  const Component = TabIcons[name][focused ? 'active' : 'inactive'][resolved];

  const style = useAnimatedStyle(() => ({
    transform: [
      { scale: withSpring(focused ? 1.2 : 1) },
      { translateY: withSpring(focused ? -2 : 0) },
    ],
    opacity: withSpring(focused ? 1 : 0.6),
  }));

  return (
    <Animated.View style={style}>
      <Component width={size} height={size} />
    </Animated.View>
  );
};

export default AnimatedTabIcon;
