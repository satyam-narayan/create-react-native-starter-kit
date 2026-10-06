import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Haptics from '@mhpdev/react-native-haptics';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import CustomButton from '@/components/shared/CustomButton';
import CustomText from '@/components/shared/text/CustomText';
import { useNetwork } from '@/context/NetworkContext';
import { useAppTheme } from '@/context/ThemeContext';
import { ErrorToast } from '@/services/toast';
import { ColorType, spacing } from '@/theme';
import { normalize } from '@/utils/normalize';
import BrokenWifiAnimation, {
  BREAK_TOTAL_MS,
} from './wifi-icon-animation/BrokenWifiAnimation';
import { useWifiIconAnimationActive } from './wifi-icon-animation/useWifiIconAnimationActive';
import type { OfflineStateProps } from './types';

const ENTER_DURATION = 450;
const NUDGE_DURATION = 1100;
const NUDGE_REST = 1900;
const SHAKE_STEP = 55;

const OfflineState = ({
  title,
  message,
  showRetry = true,
}: OfflineStateProps) => {
  const { t } = useTranslation();
  const { color } = useAppTheme();
  const styles = useMemo(() => makeStyles(color), [color]);
  const { refresh } = useNetwork();
  const [checking, setChecking] = useState(false);
  const enter = useSharedValue(0);
  const nudge = useSharedValue(0);
  const shake = useSharedValue(0);
  const animationsActive = useWifiIconAnimationActive();

  useEffect(() => {
    enter.value = withTiming(1, {
      duration: ENTER_DURATION,
      easing: Easing.bezier(0.22, 1, 0.36, 1),
    });
  }, [enter]);

  useEffect(() => {
    if (!animationsActive) {
      // Assigning a plain value cancels the running loop.
      nudge.value = 0;
      return;
    }
    // Starts once the wifi has broken, then repeats as a gentle reminder.
    nudge.value = withDelay(
      BREAK_TOTAL_MS,
      withRepeat(
        withSequence(
          withTiming(1, {
            duration: NUDGE_DURATION,
            easing: Easing.bezier(0.22, 1, 0.36, 1),
          }),
          withTiming(0, { duration: 0 }),
          withDelay(NUDGE_REST, withTiming(0, { duration: 0 })),
        ),
        -1,
        false,
      ),
    );
  }, [animationsActive, nudge]);

  const enterStyle = useAnimatedStyle(() => ({
    opacity: enter.value,
    transform: [{ translateY: 16 * (1 - enter.value) }],
  }));

  // Bump up then settle during the first part of each nudge.
  const retryStyle = useAnimatedStyle(() => {
    const n = nudge.value;
    const bump = n < 0.35 ? n / 0.35 : Math.max(0, 1 - (n - 0.35) / 0.35);
    return {
      transform: [{ translateX: shake.value }, { scale: 1 + 0.05 * bump }],
    };
  });

  const haloStyle = useAnimatedStyle(() => {
    const n = nudge.value;
    return {
      opacity: n > 0 ? 0.35 * (1 - n) : 0,
      transform: [{ scaleX: 1 + 0.12 * n }, { scaleY: 1 + 0.45 * n }],
    };
  });

  const shakeRetry = useCallback(() => {
    shake.value = withSequence(
      withTiming(-8, { duration: SHAKE_STEP }),
      withTiming(8, { duration: SHAKE_STEP }),
      withTiming(-6, { duration: SHAKE_STEP }),
      withTiming(6, { duration: SHAKE_STEP }),
      withTiming(0, { duration: SHAKE_STEP }),
    );
    Haptics.notification('error');
  }, [shake]);

  const handleRetry = useCallback(async () => {
    setChecking(true);
    try {
      const online = await refresh();
      if (!online) {
        shakeRetry();
        ErrorToast({
          title: t('network.unavailableTitle'),
          message: t('network.unavailableMessage'),
        });
      }
    } finally {
      setChecking(false);
    }
  }, [refresh, shakeRetry, t]);

  return (
    <View style={styles.container} accessibilityRole="summary">
      <Animated.View style={[styles.content, enterStyle]}>
        <View style={styles.illustration}>
          <View style={styles.glow} />
          <BrokenWifiAnimation size={ICON_SIZE} active={animationsActive} />
        </View>

        <CustomText
          variant="title"
          weight="700"
          textColor={color.text_heading}
          textAlign="center"
          style={styles.title}
        >
          {title ?? t('network.unavailableTitle')}
        </CustomText>

        <CustomText
          variant="label"
          weight="400"
          textColor={color.text_body}
          textAlign="center"
          style={styles.message}
        >
          {message ?? t('network.unavailableBody')}
        </CustomText>

        {showRetry ? (
          <Animated.View style={retryStyle}>
            <Animated.View
              pointerEvents="none"
              style={[styles.retryHalo, haloStyle]}
            />
            <CustomButton
              title={t('common.retry')}
              onPress={handleRetry}
              loading={checking}
              borderRadius={999}
              containerStyle={styles.retryButton}
              textStyle={styles.retryText}
            />
          </Animated.View>
        ) : null}
      </Animated.View>
    </View>
  );
};

const ICON_SIZE = normalize(120);
const GLOW_SIZE = normalize(150);

const makeStyles = (color: ColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.xl,
      paddingBottom: normalize(80),
      backgroundColor: color.background_primary,
    },
    content: {
      alignItems: 'center',
    },
    illustration: {
      width: GLOW_SIZE,
      height: GLOW_SIZE,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
    },
    glow: {
      position: 'absolute',
      width: GLOW_SIZE,
      height: GLOW_SIZE,
      borderRadius: GLOW_SIZE / 2,
      backgroundColor: color.primary_wash,
    },
    title: {
      marginBottom: spacing.sm,
    },
    message: {
      maxWidth: normalize(280),
      lineHeight: normalize(21),
      marginBottom: spacing.lg,
    },
    retryHalo: {
      ...StyleSheet.absoluteFill,
      borderRadius: 999,
      backgroundColor: color.primary,
    },
    retryButton: {
      minWidth: normalize(180),
      minHeight: normalize(48),
    },
    /** The shared `button` variant uses lineHeight === fontSize, which clips descenders. */
    retryText: {
      lineHeight: normalize(20),
    },
  });

export default memo(OfflineState);
