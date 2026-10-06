import {
  Platform,
  StyleSheet,
  type TextStyle,
  type StyleProp,
} from 'react-native';
import { normalize } from '@/utils/normalize';

/** Devanagari needs more vertical room than Latin for matras. */
const HINDI_LINE_HEIGHT_RATIO = 1.45;

export const isHindiLanguage = (lng?: string | null) =>
  (lng ?? '').toLowerCase().startsWith('hi');

/**
 * Hindi-only text metrics. Apply after the base styles so other languages stay unchanged.
 * Inflates tight lineHeights and restores Android font padding for matras.
 */
export const getHindiTextStyle = (
  style?: StyleProp<TextStyle>,
): TextStyle | undefined => {
  const flat = StyleSheet.flatten(style) ?? {};
  const fontSize =
    typeof flat.fontSize === 'number' ? flat.fontSize : normalize(14);
  const minLineHeight = Math.ceil(fontSize * HINDI_LINE_HEIGHT_RATIO);
  const currentLineHeight =
    typeof flat.lineHeight === 'number' ? flat.lineHeight : fontSize;

  return {
    lineHeight: Math.max(currentLineHeight, minLineHeight),
    ...(Platform.OS === 'android' ? { includeFontPadding: true } : null),
  };
};
