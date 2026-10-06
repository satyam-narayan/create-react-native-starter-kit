import { memo } from 'react';
import { StyleSheet } from 'react-native';
import PressableIcon from '../PressableIcon';
import { IconName } from '@/assets/icons';
import { useAppTheme } from '@/context/ThemeContext';
import { normalize } from '@/utils/normalize';

type Props = {
  icon: IconName;
  onPress?: () => void;
  /** Round elevated container (e.g. back). When false, icon only. */
  isIconContainer?: boolean;
  iconSize?: number;
  accessibilityLabel?: string;
};

const HeaderActionButton = ({
  icon,
  onPress,
  isIconContainer = false,
  iconSize,
  accessibilityLabel,
}: Props) => {
  const { color } = useAppTheme();

  if (!isIconContainer) {
    return (
      <PressableIcon
        name={icon}
        size={iconSize ?? 32}
        onPress={onPress}
        hitSlop={12}
        containerStyle={styles.plain}
        accessibilityLabel={accessibilityLabel}
      />
    );
  }

  return (
    <PressableIcon
      name={icon}
      size={iconSize ?? 14}
      onPress={onPress}
      hitSlop={8}
      backgroundColor={color.background_primary}
      borderRadius={20}
      containerStyle={[styles.container, { shadowColor: color.shadow_strong }]}
      accessibilityLabel={accessibilityLabel}
    />
  );
};

export default memo(HeaderActionButton);

const styles = StyleSheet.create({
  plain: {
    width: normalize(32),
    height: normalize(32),
    backgroundColor: 'transparent',
  },
  container: {
    width: 40,
    height: 40,
    overflow: 'visible',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 8,
  },
});
