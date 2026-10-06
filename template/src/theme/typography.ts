import { normalize } from '@/utils/normalize';
import { FontFamily } from './fonts';

export type FontWeight = '200' | '300' | '400' | '500' | '600' | '700' | '800';

export const FONT_MAP: Record<FontWeight, string> = {
  '200': FontFamily.InterTightExtraLight,
  '300': FontFamily.InterTightLight,
  '400': FontFamily.InterTightRegular,
  '500': FontFamily.InterTightMedium,
  '600': FontFamily.InterTightSemiBold,
  '700': FontFamily.InterTightBold,
  '800': FontFamily.InterTightExtraBold,
};

export type TextVariant =
  | 'caption'
  | 'micro'
  | 'footnote'
  | 'subtitle'
  | 'label'
  | 'callout'
  | 'body'
  | 'titleMd'
  | 'titleSm'
  | 'title'
  | 'header'
  | 'display'
  | 'hero'
  | 'button';

export const TYPOGRAPHY = {
  caption: {
    fontSize: normalize(10),
  },
  micro: {
    fontSize: normalize(11),
  },
  footnote: {
    fontSize: normalize(12),
  },
  subtitle: {
    fontSize: normalize(13),
  },
  label: {
    fontSize: normalize(14),
    marginBottom: 8,
  },
  callout: {
    fontSize: normalize(15),
  },
  body: {
    fontSize: normalize(16),
    marginBottom: 8,
  },
  titleMd: {
    fontSize: normalize(17),
  },
  titleSm: {
    fontSize: normalize(18),
  },
  title: {
    fontSize: normalize(20),
    marginBottom: 8,
  },
  header: {
    fontSize: normalize(24),
    marginBottom: 24,
  },
  display: {
    fontSize: normalize(26),
  },
  hero: {
    fontSize: normalize(30),
  },
  button: {
    fontSize: normalize(16),
    textAlign: 'center',
  },
} as const;
