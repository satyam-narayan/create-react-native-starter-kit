import Haptics from '@mhpdev/react-native-haptics';
import React, { memo, useCallback, useRef } from 'react';
import {
  Pressable,
  StyleSheet,
  ViewStyle,
  StyleProp,
  Insets,
} from 'react-native';
import { isIOS } from '@/constants/device';
import Icon from './Icon';
import { IconName } from '@/assets/icons';

type HapticType = 'light' | 'medium' | 'heavy' | 'soft' | 'rigid';

export interface PressableIconProps {
  name: IconName;
  size?: number;
  color?: string;
  onPress?: () => Promise<void> | void;
  onLongPress?: () => void;
  disabled?: boolean;
  haptic?: HapticType;
  hitSlop?: number | Insets;
  backgroundColor?: string;
  borderRadius?: number;
  containerStyle?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

const PressableIcon = ({
  name,
  size = 22,
  color,
  onPress,
  onLongPress,
  disabled = false,
  haptic = 'light',
  hitSlop = 8,
  backgroundColor,
  borderRadius,
  containerStyle,
  accessibilityLabel,
}: PressableIconProps) => {
  const pressLock = useRef(false);

  const handlePress = useCallback(async () => {
    if (pressLock.current || disabled) return;

    pressLock.current = true;
    Haptics.impact(haptic);

    try {
      await onPress?.();
    } finally {
      pressLock.current = false;
    }
  }, [disabled, haptic, onPress]);

  return (
    <Pressable
      onPress={handlePress}
      onLongPress={onLongPress}
      disabled={disabled}
      hitSlop={hitSlop}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? name}
      accessibilityState={{ disabled }}
      android_ripple={{ color: 'transparent' }}
      style={({ pressed }) => [
        styles.base,
        backgroundColor != null && { backgroundColor },
        borderRadius != null && { borderRadius },
        disabled && styles.disabled,
        pressed && isIOS && styles.pressedIOS,
        pressed && !isIOS && styles.pressedAndroid,
        containerStyle,
      ]}
    >
      <Icon name={name} size={size} color={color} />
    </Pressable>
  );
};

export default memo(PressableIcon);

const styles = StyleSheet.create({
  base: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  disabled: {
    opacity: 0.5,
  },
  pressedIOS: {
    opacity: 0.7,
    transform: [{ scale: 0.94 }],
  },
  pressedAndroid: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
});
