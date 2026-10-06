import { StyleSheet } from 'react-native';
import { FontFamily } from '@/theme';
import { normalize } from '@/utils/normalize';

/** Shared Figma field chrome — used by FormInput variants as defaults. */
export const FORM_FIELD = {
  height: normalize(48),
  radius: normalize(10),
  paddingH: normalize(14),
  fontSize: normalize(13),
  lineHeight: normalize(18),
  labelGap: normalize(6),
  iconSize: normalize(20),
} as const;

export const formFieldText = StyleSheet.create({
  input: {
    flex: 1,
    width: '100%',
    fontFamily: FontFamily.InterTightRegular,
    fontSize: FORM_FIELD.fontSize,
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingVertical: 0,
    margin: 0,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  /** Hindi-only — applied after `input` so English metrics stay unchanged. */
  inputHindi: {
    includeFontPadding: true,
  },
  dropdownText: {
    fontFamily: FontFamily.InterTightRegular,
    fontSize: FORM_FIELD.fontSize,
    lineHeight: FORM_FIELD.lineHeight,
  },
  dropdownTextHindi: {
    lineHeight: Math.ceil(FORM_FIELD.fontSize * 1.35),
    includeFontPadding: true,
  },
});
