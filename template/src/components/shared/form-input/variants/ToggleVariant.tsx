import { useAppTheme } from '@/context/ThemeContext';
import { normalize } from '@/utils/normalize';
import React, { memo, useEffect } from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import CustomText from '@/components/shared/text/CustomText';
import { ToggleVariantProps } from '../type';

type RHFToggleField = {
  value: boolean;
  onChange: (value: boolean) => void;
};
type ToggleFormMode = {
  mode: 'form';
  field: RHFToggleField;
};

type ToggleStandaloneMode = {
  mode: 'standalone';
  value: boolean;
  onChange: (value: boolean) => void;
  alignToggle?: ViewStyle['alignItems'];
};

export type ToggleVisualProps =
  | (ToggleFormMode & ToggleVariantProps)
  | (ToggleStandaloneMode & ToggleVariantProps);

const SIZE_MAP = {
  sm: {
    width: 52,
    height: 26,
    thumb: 22,
    padding: 2,
    labelSize: normalize(9),
  },
  md: {
    width: 60,
    height: 32,
    thumb: 28,
    padding: 2,
    labelSize: normalize(11),
  },
} as const;

const Toggle = (props: ToggleVisualProps) => {
  const {
    disabled = false,
    size = 'md',

    showLabel = true,
    onLabel = 'ON',
    offLabel = 'OFF',

    activeColor,
    inactiveColor,
    thumbColor,
    styles: styleOverrides,
    mode,
  } = props;

  const { width, height, thumb, padding, labelSize } = SIZE_MAP[size];
  const { color } = useAppTheme();
  const resolvedValue = mode === 'form' ? props.field.value : props.value;
  const handleChange = mode === 'form' ? props.field.onChange : props.onChange;
  const labelJustify = resolvedValue ? 'flex-start' : 'flex-end';
  const alignToggleEnd: ViewStyle['alignItems'] =
    mode === 'standalone' && props.alignToggle ? props.alignToggle : 'flex-end';
  const thumbCont = {
    width: thumb,
    height: thumb,
    borderRadius: thumb / 2,
    backgroundColor: thumbColor || color.background_primary,
    right: size === 'sm' ? 28 : 30,
  };
  const pressableOpacity = disabled ? 0.6 : 1.0;
  const activeClr = activeColor || color.primary;
  const inactiveClr = inactiveColor || color.placeholder;
  const formWrapper: ViewStyle =
    mode === 'form'
      ? { position: 'absolute', right: 0 }
      : { position: 'relative' };

  const travelDistance = width - thumb - padding * 2;

  const translateX = useSharedValue(resolvedValue ? travelDistance : 0);

  useEffect(() => {
    translateX.value = withTiming(resolvedValue ? travelDistance : 0, {
      duration: 180,
    });
  }, [resolvedValue, travelDistance, translateX]);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handlePress = () => {
    handleChange?.(!resolvedValue);
  };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="switch"
      accessibilityState={{ checked: resolvedValue, disabled }}
      style={[
        { opacity: pressableOpacity, alignItems: alignToggleEnd },
        formWrapper,
        styleOverrides?.wrapper,
      ]}
      disabled={disabled}
    >
      {/* Track */}
      <View
        style={[
          styles.track,
          {
            width,
            height,
            borderRadius: height / 2,
            padding,
            backgroundColor: resolvedValue ? activeClr : inactiveClr,
          },
          styleOverrides?.track,
        ]}
      >
        {/* ON / OFF Label (SAFE, CONDITIONAL) */}
        {showLabel && (
          <View
            pointerEvents="none"
            style={[
              styles.labelContainer,
              {
                justifyContent: labelJustify,
              },
              styles.labelContainer,
            ]}
          >
            <CustomText
              variant="label"
              weight="600"
              numberOfLines={1}
              ellipsizeMode="clip"
              textColor={color.text_default}
              textAlign="center"
              style={[styles.label, { fontSize: labelSize }, styleOverrides?.label]}
            >
              {resolvedValue ? onLabel : offLabel}
            </CustomText>
          </View>
        )}

        {/* Thumb */}
        <Animated.View
          style={[styles.thumb, thumbCont, thumbStyle, styleOverrides?.thumb]}
        />
      </View>
    </Pressable>
  );
};

export default memo(Toggle);

const styles = StyleSheet.create({
  track: {
    justifyContent: 'center',
  },
  thumb: {
    position: 'absolute',
    elevation: 2,
  },
  labelContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    left: 6,
    right: 6,
  },
  label: {
    marginBottom: 0,
  },
});
