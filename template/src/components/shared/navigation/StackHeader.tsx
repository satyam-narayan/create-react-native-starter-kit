import React, { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import HeaderActionButton from './HeaderActionButton';
import CustomText from '../text/CustomText';
import { IconName } from '@/assets/icons';
import { useAppTheme } from '@/context/ThemeContext';
import { ColorType, spacing } from '@/theme';
import { normalize } from '@/utils/normalize';

type Props = {
  title: string;
  onBack?: () => void;
  rightIcon?: IconName;
  onRightPress?: () => void;
  rightAccessibilityLabel?: string;
};

/** Full screen header — avoids iOS native bar-button glass wrapping. */
const StackHeader = ({
  title,
  onBack,
  rightIcon,
  onRightPress,
  rightAccessibilityLabel,
}: Props) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { color } = useAppTheme();
  const styles = useMemo(() => makeStyles(color), [color]);

  return (
    <View style={[styles.wrap, { paddingTop: insets.top }]}>
      <View style={styles.row}>
        <View style={styles.side}>
          {onBack ? (
            <HeaderActionButton
              icon="back"
              isIconContainer
              onPress={onBack}
              accessibilityLabel={t('common.back')}
            />
          ) : null}
        </View>

        <View style={styles.titleWrap} pointerEvents="none">
          <CustomText
            variant="titleMd"
            weight="600"
            textColor={color.text_primary}
            textAlign="center"
            numberOfLines={1}
            style={styles.title}
          >
            {title}
          </CustomText>
        </View>

        <View style={[styles.side, styles.sideRight]}>
          {rightIcon ? (
            <HeaderActionButton
              icon={rightIcon}
              onPress={onRightPress}
              accessibilityLabel={rightAccessibilityLabel}
            />
          ) : null}
        </View>
      </View>
    </View>
  );
};

export default memo(StackHeader);

const makeStyles = (color: ColorType) =>
  StyleSheet.create({
    wrap: {
      backgroundColor: color.background_primary,
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.sm,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: normalize(44),
    },
    side: {
      width: normalize(40),
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    sideRight: {
      alignItems: 'flex-end',
    },
    titleWrap: {
      flex: 1,
      paddingHorizontal: spacing.sm,
    },
    title: {
      marginBottom: 0,
      lineHeight: normalize(22),
      letterSpacing: -0.4,
    },
  });
