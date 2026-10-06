import { palette } from './palette';
import { light } from './light';
import { IconName } from '@/assets/icons';

export const dark = {
  color: {
    primary: palette.blue[400],
    primary_soft: palette.blue[500],
    primary_wash: palette.black[200],
    primary_accent: palette.blue[400],
    primary_deep: palette.blue[600],
    secondary: palette.blue[400],
    secondary_muted: palette.blue[600],
    background_primary: palette.black[900],
    background_secondary: palette.black[200],
    background_muted: palette.black[200],
    background_soft: palette.black[200],
    text_primary: palette.white[900],
    text_secondary: palette.gray[400],
    text_heading: palette.white[900],
    text_body: palette.gray[400],
    text_subtle: palette.gray[400],
    text_input: palette.white[900],
    text_placeholder: palette.gray[400],
    border: palette.gray[300],
    placeholder: palette.gray[400],
    text_default: palette.white[900],
    danger: palette.red[500],
    danger_soft: palette.red[500],
    danger_strong: palette.red[600],
    success: palette.green[500],
    info: palette.blue[400],
    disabled: palette.gray[300],
    shadow: palette.black[500],
    shadow_strong: palette.black[900],
  },
  icon: {
    tooltip: 'tooltip_dark',
  } satisfies Record<keyof typeof light.icon, IconName>,
} satisfies typeof light;
