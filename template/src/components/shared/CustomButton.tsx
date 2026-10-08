import { useNetwork } from '@/context/NetworkContext';
import { useAppTheme } from '@/context/ThemeContext';
import { OfflineToast } from '@/services/toast';
import Haptics from '@mhpdev/react-native-haptics';
import React, { memo, useRef, useCallback, ReactNode, useMemo } from 'react';
import {
  Pressable,
  View,
  ActivityIndicator,
  StyleSheet,
  TextStyle,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import CustomText from './text/CustomText';
import { normalize } from '@/utils/normalize';
import { isHindiLanguage } from '@/utils/hindiText';
import { isIOS } from '@/constants/device';
import Icon from './Icon';
import { IconName } from '@/assets/icons';
import type { FontWeight, TextVariant } from '@/theme/typography';

/* ───────────────── Types ───────────────── */

type Variant = 'primary' | 'outline' | 'danger' | 'ghost';
type Align = 'left' | 'center' | 'right';
type HapticType = 'light' | 'medium' | 'heavy' | 'soft' | 'rigid';

export interface AppButtonProps {
  title?: string;
  onPress?: () => Promise<void> | void;
  onLongPress?: () => void;

  variant?: Variant;
  overrideVariantColor?: string;
  overrideVariantTextColor?: string;

  disabled?: boolean;
  loading?: boolean;
  /** Blocks the press while offline and shows a toast (use for API actions). */
  requiresNetwork?: boolean;

  align?: Align;
  fullWidth?: boolean;

  leftIcon?: IconName;
  rightIcon?: IconName;
  iconSize?: number;

  haptic?: HapticType;

  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  textVariant?: TextVariant;
  textWeight?: FontWeight;

  backgroundColor?: string;
  borderRadius?: number;

  children?: ReactNode;
}

const CustomButton = ({
  title,
  onPress,
  onLongPress,

  variant = 'primary',
  overrideVariantColor,
  overrideVariantTextColor,

  disabled = false,
  loading = false,
  requiresNetwork = false,

  align = 'center',
  fullWidth = false,

  leftIcon,
  rightIcon,
  iconSize = 18,

  haptic = 'light',

  backgroundColor,
  borderRadius = 16,

  containerStyle,
  textStyle,
  textVariant = 'button',
  textWeight = '600',
  children,
}: AppButtonProps) => {
  const pressLock = useRef(false);
  const { color } = useAppTheme();
  const { t, i18n } = useTranslation();
  const isHindi = isHindiLanguage(i18n.language);
  const { isOffline } = useNetwork();
  const isNetworkBlocked = requiresNetwork && isOffline;

  const handlePress = useCallback(async () => {
    if (pressLock.current || disabled || loading) return;

    if (isNetworkBlocked) {
      OfflineToast({ message: t('network.unavailableMessage') });
      return;
    }

    pressLock.current = true;
    try {
      Haptics.impact(haptic);
      await onPress?.();
    } finally {
      pressLock.current = false;
    }
  }, [isNetworkBlocked, disabled, loading, onPress, haptic, t]);

  const alignSelf: ViewStyle['alignSelf'] =
    align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center';

  const isIconOnly = !title && !children && !!(leftIcon || rightIcon);

  const variantButtonStyle = useMemo(
    () => ({
      primary: { backgroundColor: overrideVariantColor || color.primary },
      danger: { backgroundColor: overrideVariantColor || color.danger },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: overrideVariantColor || color.primary,
      },
      ghost: {
        backgroundColor: overrideVariantColor || 'transparent',
      },
    }),
    [color, overrideVariantColor],
  );

  const variantTextStyle = useMemo(
    () => ({
      primary: { color: overrideVariantTextColor || color.text_default },
      danger: { color: overrideVariantTextColor || color.text_default },
      outline: { color: overrideVariantTextColor || color.primary },
      ghost: { color: color.primary },
    }),
    [color, overrideVariantTextColor],
  );

  return (
    <Pressable
      onPress={handlePress}
      onLongPress={onLongPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      style={({ pressed }) => [
        buttonStyles.base,
        isHindi && buttonStyles.baseHindi,
        variantButtonStyle[variant],
        fullWidth && buttonStyles.fullWidth,
        disabled && buttonStyles.disabled,
        pressed && isIOS && buttonStyles.pressedIOS,
        pressed && !isIOS && buttonStyles.pressedAndroid,
        { alignSelf },
        backgroundColor && { backgroundColor },
        { borderRadius },
        containerStyle,
      ]}
      android_ripple={{
        color: 'rgba(255,255,255,0.2)',
        borderless: true,
        foreground: true,
      }}
    >
      {isIconOnly ? (
        <Icon name={(leftIcon || rightIcon)!} size={iconSize} />
      ) : (
        <>
          {leftIcon && (
            <View style={fullWidth && buttonStyles.leftIcon}>
              <Icon name={leftIcon} size={iconSize} />
            </View>
          )}
          <View style={buttonStyles.content}>
            {title ? (
              <CustomText
                style={[
                  buttonStyles.title,
                  loading && buttonStyles.hidden,
                  variantTextStyle[variant],
                  textStyle,
                ]}
                variant={textVariant}
                weight={textWeight}
                numberOfLines={1}
              >
                {title}
              </CustomText>
            ) : (
              children
            )}
          </View>
          {rightIcon && (
            <View style={fullWidth && buttonStyles.rightIcon}>
              <Icon name={rightIcon} size={iconSize} />
            </View>
          )}
        </>
      )}

      {loading && (
        <View style={buttonStyles.loader}>
          <ActivityIndicator color={variantTextStyle[variant].color} />
        </View>
      )}
    </Pressable>
  );
};

export default memo(CustomButton);

const buttonStyles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    padding: 12,
    minHeight: normalize(46),
    gap: 8,
  },
  /** Extra vertical room for Devanagari matras inside overflow:hidden. */
  baseHindi: {
    paddingVertical: 14,
    minHeight: normalize(50),
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.8,
  },
  pressedIOS: {
    opacity: 0.9,
    transform: [{ scale: 0.94 }],
  },
  pressedAndroid: {
    opacity: 0.9,
    transform: [{ scale: 0.96 }],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },
  title: {
    flexShrink: 0,
  },
  loader: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hidden: {
    opacity: 0,
  },
  leftIcon: { position: 'absolute', left: 14 },
  rightIcon: { position: 'absolute', right: 14 },
});
