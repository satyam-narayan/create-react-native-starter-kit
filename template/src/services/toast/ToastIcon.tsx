import React, { memo } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import type { IconName } from '@/assets/icons';
import Icon from '@/components/shared/Icon';
import type { ToastVariant } from './toastStore';

export const TOAST_ICON_SIZE = 30;
const GLYPH = 18;
const STROKE = {
  fill: 'none',
  strokeWidth: 2.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

type Props = {
  variant: ToastVariant;
  accent: string;
  glyphColor: string;
  icon?: IconName;
  thumbnailUri?: string;
};

const Glyph = memo(
  ({ variant, color }: { variant: ToastVariant; color: string }) => {
    switch (variant) {
      case 'success':
        return <Path d="M6 12.5l4 4 8-9" stroke={color} {...STROKE} />;
      case 'error':
        return (
          <>
            <Path d="M12 6.5v7" stroke={color} {...STROKE} />
            <Circle cx={12} cy={17.5} r={1.5} fill={color} />
          </>
        );
      case 'offline':
        return (
          <>
            <Path d="M4.5 10a11 11 0 0 1 15 0" stroke={color} {...STROKE} />
            <Path d="M8 13.5a6 6 0 0 1 8 0" stroke={color} {...STROKE} />
            <Circle cx={12} cy={17.5} r={1.5} fill={color} />
            <Path d="M4 4l16 16" stroke={color} {...STROKE} />
          </>
        );
      default:
        return (
          <>
            <Circle cx={12} cy={6.8} r={1.5} fill={color} />
            <Path d="M12 10.5v7" stroke={color} {...STROKE} />
          </>
        );
    }
  },
);

/** Solid accent circle with a status glyph, or a custom icon / image preview. */
const ToastIcon = ({
  variant,
  accent,
  glyphColor,
  icon,
  thumbnailUri,
}: Props) => {
  if (thumbnailUri) {
    return <Image source={{ uri: thumbnailUri }} style={styles.thumbnail} />;
  }

  return (
    <View style={[styles.circle, { backgroundColor: accent }]}>
      {icon ? (
        <Icon name={icon} size={GLYPH} color={glyphColor} />
      ) : (
        <Svg width={GLYPH} height={GLYPH} viewBox="0 0 24 24">
          <Glyph variant={variant} color={glyphColor} />
        </Svg>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    width: TOAST_ICON_SIZE,
    height: TOAST_ICON_SIZE,
    borderRadius: TOAST_ICON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnail: {
    width: TOAST_ICON_SIZE,
    height: TOAST_ICON_SIZE,
    borderRadius: TOAST_ICON_SIZE / 2,
  },
});

export default memo(ToastIcon);
