import React, { memo, useCallback, useMemo } from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import CustomText from '../../text/CustomText';
import CustomButton, { AppButtonProps } from '../../CustomButton';
import Icon from '../../Icon';
import BaseModal from '../BaseModal';
import { useAppTheme } from '@/context/ThemeContext';
import { IconName } from '@/assets/icons';
import { spacing } from '@/theme';

interface AlertModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  icon?: IconName;
  iconSize?: number;
  showPrimaryButton?: boolean;
  showSecondaryButton?: boolean;
  primaryButton?: Partial<Omit<AppButtonProps, 'onPress'>>;
  secondaryButton?: Partial<Omit<AppButtonProps, 'onPress'>>;
  onClose?: () => void;
  closeOnOverlayPress?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  onPressPrimaryBtn?: () => void;
  onPressSecondaryBtn?: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  title,
  description,
  icon,
  iconSize = 40,
  showPrimaryButton = true,
  showSecondaryButton = true,
  primaryButton,
  secondaryButton,
  onClose,
  closeOnOverlayPress = false,
  contentStyle,
  onPressPrimaryBtn,
  onPressSecondaryBtn,
}) => {
  const { color } = useAppTheme();

  const resolvedPrimary = useMemo(
    () => ({
      title: 'Yes',
      variant: 'danger' as const,
      overrideVariantColor: color.danger_strong,
      ...primaryButton,
    }),
    [color.danger_strong, primaryButton],
  );

  const resolvedSecondary = useMemo(
    () => ({
      title: 'Cancel',
      variant: 'outline' as const,
      overrideVariantColor: color.border,
      overrideVariantTextColor: color.text_secondary,
      ...secondaryButton,
    }),
    [color.border, color.text_secondary, secondaryButton],
  );

  const handlePrimaryPress = useCallback(() => {
    onPressPrimaryBtn?.();
  }, [onPressPrimaryBtn]);

  const handleSecondaryPress = useCallback(() => {
    onPressSecondaryBtn?.();
  }, [onPressSecondaryBtn]);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose ?? onPressSecondaryBtn}
      disableOverlayPress={!closeOnOverlayPress}
      contentStyle={[styles.content, contentStyle]}
    >
      {icon ? (
        <View style={styles.iconWrap}>
          <Icon
            name={icon}
            size={iconSize}
          />
        </View>
      ) : null}

      <CustomText
        variant="titleSm"
        weight="700"
        textColor={color.text_heading}
        textAlign="center"
        style={styles.title}
      >
        {title}
      </CustomText>

      {description ? (
        <CustomText
          variant="label"
          weight="400"
          textColor={color.text_secondary}
          textAlign="center"
          style={styles.description}
        >
          {description}
        </CustomText>
      ) : null}

      {(showPrimaryButton || showSecondaryButton) && (
        <View style={styles.buttonContainer}>
          {showSecondaryButton ? (
            <CustomButton
              {...resolvedSecondary}
              onPress={handleSecondaryPress}
              borderRadius={14}
              textVariant="button"
              textWeight="600"
              containerStyle={[styles.button, resolvedSecondary.containerStyle]}
            />
          ) : null}

          {showPrimaryButton ? (
            <CustomButton
              {...resolvedPrimary}
              onPress={handlePrimaryPress}
              borderRadius={14}
              textVariant="button"
              textWeight="600"
              containerStyle={[styles.button, resolvedPrimary.containerStyle]}
            />
          ) : null}
        </View>
      )}
    </BaseModal>
  );
};

export default memo(AlertModal);

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
  },
  iconWrap: {
    marginBottom: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginBottom: 8,
    width: '100%',
  },
  description: {
    marginBottom: 24,
    width: '100%',
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    alignItems: 'stretch',
  },
  button: {
    flex: 1,
    minHeight: 48,
    paddingVertical: 14,
  },
});
