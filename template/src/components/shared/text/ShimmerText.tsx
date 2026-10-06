import { useAppTheme } from '@/context/ThemeContext';
import { FONT_MAP, TYPOGRAPHY } from '@/theme/typography';
import { getHindiTextStyle, isHindiLanguage } from '@/utils/hindiText';
import React, { memo, useState, useMemo } from 'react';
import { Text, StyleSheet, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import BaseSkelton from '../skelton/BaseSkelton';
import { textLayout } from '../skelton/layouts';
import { ShimmerTextProps } from './types';

const ShimmerText = ({
  weight = '400',
  variant = 'body',
  textColor,
  style,
  textAlign,
  isLoading = false,
  shimmerWidth = 100,
  shimmerHeight = 30,
  containerStyle,
  onPress,
  children,
  ellipsizeMode,
  numberOfLines,
}: ShimmerTextProps) => {
  const { color } = useAppTheme();
  const { i18n } = useTranslation();
  const isHindi = isHindiLanguage(i18n.language);
  const [pressed, setPressed] = useState<boolean>(false);
  const opacity = pressed ? 0.8 : 1;
  const isPressable = typeof onPress === 'function';

  const handlePressIn = () => setPressed(true);
  const handlePressOut = () => setPressed(false);

  const typographyStyle = TYPOGRAPHY[variant];

  const containerAlignStyle = useMemo((): ViewStyle => {
    switch (textAlign) {
      case 'center':
        return { alignItems: 'center' };
      case 'right':
        return { alignItems: 'flex-end' };
      default:
        return { alignItems: 'flex-start' };
    }
  }, [textAlign]);

  const flatStyle = StyleSheet.flatten(style) || {};
  const {
    margin,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    marginHorizontal,
    marginVertical,
    padding,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    paddingHorizontal,
    paddingVertical,
    alignSelf,
    flex,
    flexGrow,
    flexShrink,
    width,
    ...textOnlyStyle
  } = flatStyle;

  const positioningStyle: ViewStyle = {
    margin,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    marginHorizontal,
    marginVertical,
    padding,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    paddingHorizontal,
    paddingVertical,
    alignSelf,
    flex,
    flexGrow,
    flexShrink,
    width,
  };

  Object.keys(positioningStyle).forEach(key => {
    if (positioningStyle[key as keyof ViewStyle] === undefined) {
      delete positioningStyle[key as keyof ViewStyle];
    }
  });

  const textStyle = useMemo(() => {
    const base = [
      styles.base,
      typographyStyle,
      {
        fontFamily: FONT_MAP[weight],
        opacity: opacity,
        color: textColor || color.text_primary,
        textAlign: textAlign,
      },
      textOnlyStyle,
    ];
    if (!isHindi) {
      return base;
    }
    return [...base, getHindiTextStyle(base)];
  }, [
    typographyStyle,
    weight,
    opacity,
    textColor,
    color.text_primary,
    textAlign,
    textOnlyStyle,
    isHindi,
  ]);

  return (
    <View style={[containerAlignStyle, positioningStyle, containerStyle]}>
      <BaseSkelton
        isLoading={isLoading}
        layout={textLayout({
          width: shimmerWidth,
          height: shimmerHeight,
        })}
      >
        <Text
          allowFontScaling={false}
          onPressIn={isPressable ? handlePressIn : undefined}
          onPressOut={isPressable ? handlePressOut : undefined}
          style={textStyle}
          onPress={isPressable ? onPress : undefined}
          children={children}
          ellipsizeMode={ellipsizeMode}
          numberOfLines={numberOfLines}
        />
      </BaseSkelton>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});

export default memo(ShimmerText);
