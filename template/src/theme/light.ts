import { IconName } from '@/assets/icons';
import { palette } from './palette';

export const light = {
  color: {
    primary: palette.blue[500],
    primary_soft: palette.blue[400],
    primary_wash: palette.blue[50],
    primary_accent: palette.blue[400],
    primary_deep: palette.blue[600],
    secondary: palette.blue[500],
    secondary_muted: palette.blue[50],
    background_primary: palette.white[900],
    background_secondary: palette.white[200],
    background_muted: palette.white[100],
    background_soft: palette.white[100],
    text_primary: palette.black[500],
    text_secondary: palette.gray[100],
    text_heading: palette.black[600],
    text_body: palette.gray[300],
    text_subtle: palette.gray[100],
    text_input: palette.black[500],
    text_placeholder: palette.gray[400],
    border: palette.gray[200],
    placeholder: palette.gray[400],
    text_default: palette.white[900],
    danger: palette.red[500],
    danger_soft: palette.red[500],
    danger_strong: palette.red[600],
    success: palette.green[500],
    info: palette.blue[400],
    disabled: palette.white[100],
    shadow: palette.black[500],
    shadow_strong: palette.black[900],
  },
  icon: {
    tooltip: 'tooltip_light' as IconName,
  } satisfies Record<string, IconName>,
};

export type ColorType = typeof light.color;
