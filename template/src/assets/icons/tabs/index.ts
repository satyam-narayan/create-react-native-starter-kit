import HomeFilledLight from './home/filled_light.svg';
import HomeFilledDark from './home/filled_dark.svg';
import HomeOutline from './home/outline.svg';
import ProfileFilledLight from './profile/filled_light.svg';
import ProfileFilledDark from './profile/filled_dark.svg';
import ProfileOutline from './profile/outline.svg';

export const TabIcons = {
  home: {
    active: {
      light: HomeFilledLight,
      dark: HomeFilledDark,
    },
    inactive: {
      light: HomeOutline,
      dark: HomeOutline,
    },
  },
  profile: {
    active: {
      light: ProfileFilledLight,
      dark: ProfileFilledDark,
    },
    inactive: {
      light: ProfileOutline,
      dark: ProfileOutline,
    },
  },
} as const;

export type TabIconName = keyof typeof TabIcons;
