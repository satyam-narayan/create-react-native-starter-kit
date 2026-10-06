import { useAppTheme } from '@/context/ThemeContext';
import { FONT_MAP, TYPOGRAPHY } from '@/theme/typography';
import { getHindiTextStyle, isHindiLanguage } from '@/utils/hindiText';
import React, { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, StyleSheet } from 'react-native';
import { CustomTextProps } from './types';

const CustomText = ({
  weight = '400',
  variant = 'body',
  textColor,
  style,
  textAlign,
  onPress,
  ellipsizeMode,
  numberOfLines,
  adjustsFontSizeToFit,
  minimumFontScale,
  children,
  ...restTextProps
}: CustomTextProps) => {
  const { color } = useAppTheme();
  const { i18n } = useTranslation();
  const [pressed, setPressed] = useState<boolean>(false);
  const opacity = pressed ? 0.8 : 1;
  const isPressable = typeof onPress === 'function';
  const isHindi = isHindiLanguage(i18n.language);

  const composedStyle = useMemo(() => {
    const base = [
      styles.base,
      TYPOGRAPHY[variant],
      {
        fontFamily: FONT_MAP[weight],
        opacity: opacity,
        color: textColor || color.text_primary,
        textAlign: textAlign,
      },
      style,
    ];

    if (!isHindi) {
      return base;
    }

    return [...base, getHindiTextStyle(base)];
  }, [
    variant,
    weight,
    opacity,
    textColor,
    color.text_primary,
    textAlign,
    style,
    isHindi,
  ]);

  const handlePressIn = () => setPressed(true);
  const handlePressOut = () => setPressed(false);
  return (
    <Text
      allowFontScaling={false}
      onPressIn={isPressable ? handlePressIn : undefined}
      onPressOut={isPressable ? handlePressOut : undefined}
      style={composedStyle}
      children={children}
      onPress={isPressable ? onPress : undefined}
      ellipsizeMode={ellipsizeMode}
      numberOfLines={numberOfLines}
      adjustsFontSizeToFit={adjustsFontSizeToFit}
      minimumFontScale={minimumFontScale}
      {...restTextProps}
    />
  );
};

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});

export default memo(CustomText);
