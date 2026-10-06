import React from 'react';
import { IconName } from '@/assets/icons';
import Icon from '@/components/shared/Icon';
import { useAppTheme } from '@/context/ThemeContext';
import { FontFamily } from '@/theme';
import { BaseToast, BaseToastProps } from 'react-native-toast-message';
import { StyleSheet } from 'react-native';

type ToastCardType = 'success' | 'error' | 'info';

const TEXT_PROPS = { allowFontScaling: false } as const;

interface ToastCardProps extends BaseToastProps {
  type: ToastCardType;
  leftIcon?: IconName;
  rightIcon?: IconName;
}

const ToastCard = ({ type, leftIcon, rightIcon, ...rest }: ToastCardProps) => {
  const { color } = useAppTheme();

  const accentByType: Record<ToastCardType, string> = {
    success: color.success,
    error: color.danger_soft,
    info: color.info,
  };

  const renderLeadingIcon = leftIcon
    ? () => <Icon name={leftIcon} size={24} style={styles.leadingIcon} />
    : undefined;

  const renderTrailingIcon = rightIcon
    ? () => <Icon name={rightIcon} size={24} style={styles.trailingIcon} />
    : undefined;

  return (
    <BaseToast
      {...rest}
      renderLeadingIcon={renderLeadingIcon}
      renderTrailingIcon={renderTrailingIcon}
      style={[
        styles.base,
        leftIcon ? styles.hasLeftIcon : styles.noLeftIcon,
        rightIcon ? styles.hasRightIcon : styles.noRightIcon,
        {
          borderLeftColor: accentByType[type],
          backgroundColor: color.background_secondary,
        },
      ]}
      contentContainerStyle={[
        styles.contentContainer,
        leftIcon ? styles.contentHasLeftIcon : styles.contentNoLeftIcon,
        rightIcon ? styles.contentHasRightIcon : styles.contentNoRightIcon,
        {
          backgroundColor: color.background_secondary,
        },
      ]}
      text1NumberOfLines={2}
      text2NumberOfLines={3}
      text1Props={TEXT_PROPS}
      text2Props={TEXT_PROPS}
      text1Style={[
        styles.text1,
        {
          color: color.text_primary,
        },
      ]}
      text2Style={[
        styles.text2,
        {
          color: color.text_primary,
        },
      ]}
    />
  );
};

export default ToastCard;

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },

  contentContainer: {
    paddingVertical: 8,
  },

  leadingIcon: {
    alignSelf: 'center',
  },

  trailingIcon: {
    alignSelf: 'center',
  },

  text1: {
    fontFamily: FontFamily.InterTightSemiBold,
  },

  text2: {
    fontFamily: FontFamily.InterTightRegular,
    fontSize: 12,
  },

  hasLeftIcon: {
    paddingLeft: 10,
  },

  noLeftIcon: {
    paddingLeft: 0,
  },

  hasRightIcon: {
    paddingRight: 10,
  },

  noRightIcon: {
    paddingRight: 2,
  },

  contentHasLeftIcon: {
    paddingLeft: 10,
  },

  contentNoLeftIcon: {
    paddingLeft: 15,
  },

  contentHasRightIcon: {
    paddingRight: 10,
  },

  contentNoRightIcon: {
    paddingRight: 15,
  },
});
