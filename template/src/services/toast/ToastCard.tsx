import React, {
  memo,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  type LayoutChangeEvent,
  PanResponder,
  Pressable,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import Animated, {
  type AnimatedStyle,
  cancelAnimation,
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import CustomText from '@/components/shared/text/CustomText';
import { useAppTheme } from '@/context/ThemeContext';
import { ColorType } from '@/theme';
import { normalize } from '@/utils/normalize';
import ToastIcon from './ToastIcon';
import { type ActiveToast, hideToast, type ToastVariant } from './toastStore';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/** Icon + countdown ring. */
const SLOT = 40;
const RING_RADIUS = 18.5;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;
const SIDE_PADDING = 8;
/** Width of the dot before it opens into the full toast. */
const DOT_WIDTH = SLOT + SIDE_PADDING * 2;
const MIN_HEIGHT = 56;
const MAX_RADIUS = 28;

/** Smooth ease-out with no overshoot, so nothing bounces. */
const EASE = Easing.bezier(0.25, 0.1, 0.25, 1);
const DOT_IN = 200;
const OPEN_DELAY = 180;
const OPEN_DURATION = 280;
const TEXT_DELAY = 300;
const TEXT_DURATION = 180;
/** Text out → close back to the dot → dot fades away. */
const TEXT_OUT = 120;
const CLOSE_DELAY = 80;
const CLOSE_DURATION = 220;
const DOT_OUT_DELAY = 280;
const DOT_OUT = 160;
export const EXIT_DURATION = DOT_OUT_DELAY + DOT_OUT;

const TAP_MAX_MS = 250;
const SWIPE_DISTANCE = 20;
const SWIPE_VELOCITY = 0.5;

/** 25% alpha suffix; theme colors are 6-digit hex. */
const BORDER_ALPHA = '40';

const toneFor = (variant: ToastVariant, color: ColorType) => {
  const accent = {
    success: color.success,
    error: color.danger,
    offline: color.primary,
    info: color.info,
  }[variant];
  return { accent, border: `${accent}${BORDER_ALPHA}` };
};

type Props = {
  toast: ActiveToast;
  visible: boolean;
};

type ContentProps = {
  toast: ActiveToast;
  styles: ReturnType<typeof makeStyles>;
  color: ColorType;
  accent: string;
  ring?: ReactNode;
  textStyle?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
  onAction?: () => void;
  /** Hidden copy used only for sizing; the fixed-size icon slot is left empty. */
  measuring?: boolean;
};

/** Rendered twice: hidden to measure the natural size, and visible inside the toast. */
const ToastContent = memo(
  ({
    toast,
    styles,
    color,
    accent,
    ring,
    textStyle,
    onAction,
    measuring,
  }: ContentProps) => (
    <>
      <View style={styles.slot}>
        {measuring ? null : (
          <>
            {ring}
            <ToastIcon
              variant={toast.variant}
              accent={accent}
              glyphColor={color.text_default}
              icon={toast.icon}
              thumbnailUri={toast.thumbnailUri}
            />
          </>
        )}
      </View>

      <Animated.View style={[styles.body, textStyle]}>
        <View style={styles.texts}>
          {toast.title ? (
            <CustomText
              variant="label"
              weight="600"
              textColor={color.text_heading}
              numberOfLines={1}
              style={styles.title}
            >
              {toast.title}
            </CustomText>
          ) : null}
          {toast.message ? (
            <CustomText
              variant="footnote"
              weight="400"
              textColor={color.text_body}
              numberOfLines={2}
              style={styles.message}
            >
              {toast.message}
            </CustomText>
          ) : null}
        </View>

        {toast.action ? (
          <>
            <View style={styles.divider} />
            <Pressable
              onPress={onAction}
              hitSlop={10}
              style={({ pressed }) => [
                styles.action,
                pressed ? styles.pressed : null,
              ]}
              accessibilityRole="button"
            >
              <CustomText
                variant="label"
                weight="700"
                textColor={accent}
                style={styles.actionText}
              >
                {toast.action.label}
              </CustomText>
            </Pressable>
          </>
        ) : null}
      </Animated.View>
    </>
  ),
);

const ToastCard = ({ toast, visible }: Props) => {
  const { id, action, duration } = toast;
  const { color } = useAppTheme();
  const styles = useMemo(() => makeStyles(color), [color]);
  const { accent, border } = useMemo(
    () => toneFor(toast.variant, color),
    [toast.variant, color],
  );
  const [size, setSize] = useState({ width: 0, height: 0 });
  const measured = size.width > 0;

  const dot = useSharedValue(0);
  const open = useSharedValue(0);
  const text = useSharedValue(0);
  const drag = useSharedValue(0);
  const timeLeft = useSharedValue(1);

  const remaining = useRef(duration);
  const startedAt = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartedAt = useRef(0);
  const visibleRef = useRef(visible);
  visibleRef.current = visible;

  const startTimer = useCallback(() => {
    // A touch released while the toast is closing must not schedule a new hide.
    if (!visibleRef.current || timer.current) {
      return;
    }
    startedAt.current = Date.now();
    timer.current = setTimeout(() => hideToast(id), remaining.current);
    timeLeft.value = withTiming(0, {
      duration: remaining.current,
      easing: Easing.linear,
    });
  }, [id, timeLeft]);

  const pauseTimer = useCallback(() => {
    if (!timer.current) {
      return;
    }
    clearTimeout(timer.current);
    timer.current = null;
    remaining.current = Math.max(
      0,
      remaining.current - (Date.now() - startedAt.current),
    );
    cancelAnimation(timeLeft);
  }, [timeLeft]);

  useEffect(() => {
    if (!measured) {
      return;
    }
    if (visible) {
      dot.value = withTiming(1, { duration: DOT_IN, easing: EASE });
      open.value = withDelay(
        OPEN_DELAY,
        withTiming(1, { duration: OPEN_DURATION, easing: EASE }),
      );
      text.value = withDelay(
        TEXT_DELAY,
        withTiming(1, { duration: TEXT_DURATION, easing: EASE }),
      );
      startTimer();
      return pauseTimer;
    }
    text.value = withTiming(0, { duration: TEXT_OUT, easing: EASE });
    open.value = withDelay(
      CLOSE_DELAY,
      withTiming(0, { duration: CLOSE_DURATION, easing: EASE }),
    );
    dot.value = withDelay(
      DOT_OUT_DELAY,
      withTiming(0, { duration: DOT_OUT, easing: EASE }),
    );
  }, [measured, visible, dot, open, text, startTimer, pauseTimer]);

  useEffect(
    () => () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      [dot, open, text, drag, timeLeft].forEach(cancelAnimation);
    },
    [dot, open, text, drag, timeLeft],
  );

  // Tap to dismiss, hold to pause, swipe up to dismiss. The action button keeps its own taps.
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, g) =>
          Math.abs(g.dy) > 6 && Math.abs(g.dy) > Math.abs(g.dx),
        onPanResponderGrant: () => {
          touchStartedAt.current = Date.now();
          pauseTimer();
        },
        onPanResponderMove: (_, g) => {
          drag.value = Math.min(0, g.dy);
        },
        onPanResponderRelease: (_, g) => {
          const isTap =
            Math.abs(g.dy) < 6 &&
            Date.now() - touchStartedAt.current < TAP_MAX_MS;
          if (isTap || g.dy < -SWIPE_DISTANCE || g.vy < -SWIPE_VELOCITY) {
            hideToast(id);
            return;
          }
          drag.value = withTiming(0, { duration: 150, easing: EASE });
          startTimer();
        },
        onPanResponderTerminate: () => {
          drag.value = withTiming(0, { duration: 150, easing: EASE });
          startTimer();
        },
      }),
    [drag, id, pauseTimer, startTimer],
  );

  const handleAction = useCallback(() => {
    hideToast(id);
    action?.onPress();
  }, [action, id]);

  const handleMeasure = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setSize(prev =>
      prev.width > 0
        ? prev
        : { width: Math.ceil(width), height: Math.max(MIN_HEIGHT, height) },
    );
  }, []);

  const toastStyle = useAnimatedStyle(() => {
    const collapsed = Math.min(DOT_WIDTH, size.width);
    return {
      width: collapsed + (size.width - collapsed) * open.value,
      opacity: dot.value,
      transform: [{ translateY: (1 - dot.value) * -12 + drag.value }],
    };
  });

  const textStyle = useAnimatedStyle(() => ({
    opacity: text.value,
  }));

  const ringProps = useAnimatedProps(() => ({
    strokeDashoffset: RING_LENGTH * (1 - timeLeft.value),
  }));

  const ring = useMemo(
    () => (
      <Svg width={SLOT} height={SLOT} style={styles.ring}>
        <Circle
          cx={SLOT / 2}
          cy={SLOT / 2}
          r={RING_RADIUS}
          stroke={border}
          strokeWidth={2}
          fill="none"
        />
        <AnimatedCircle
          cx={SLOT / 2}
          cy={SLOT / 2}
          r={RING_RADIUS}
          stroke={accent}
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${RING_LENGTH} ${RING_LENGTH}`}
          animatedProps={ringProps}
        />
      </Svg>
    ),
    [styles.ring, border, accent, ringProps],
  );

  if (!measured) {
    return (
      <View style={styles.measureLayer} pointerEvents="none">
        <View style={styles.row} onLayout={handleMeasure}>
          <ToastContent
            toast={toast}
            styles={styles}
            color={color}
            accent={accent}
            measuring
          />
        </View>
      </View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          height: size.height,
          borderRadius: Math.min(size.height / 2, MAX_RADIUS),
          borderColor: border,
          shadowColor: accent,
        },
        toastStyle,
      ]}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      {...panResponder.panHandlers}
    >
      <View
        style={[
          styles.row,
          styles.rowPlaced,
          { width: size.width, height: size.height },
        ]}
      >
        <ToastContent
          toast={toast}
          styles={styles}
          color={color}
          accent={accent}
          ring={ring}
          textStyle={textStyle}
          onAction={handleAction}
        />
      </View>
    </Animated.View>
  );
};

const makeStyles = (color: ColorType) =>
  StyleSheet.create({
    measureLayer: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      alignItems: 'center',
      opacity: 0,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: MIN_HEIGHT,
      paddingVertical: 8,
      paddingLeft: SIDE_PADDING,
      paddingRight: SIDE_PADDING + 10,
    },
    rowPlaced: {
      position: 'absolute',
      left: 0,
      top: 0,
    },
    toast: {
      overflow: 'hidden',
      borderWidth: 1,
      backgroundColor: color.background_primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.18,
      shadowRadius: 16,
      elevation: 8,
    },
    slot: {
      width: SLOT,
      height: SLOT,
      alignItems: 'center',
      justifyContent: 'center',
    },
    ring: {
      position: 'absolute',
      transform: [{ rotate: '-90deg' }],
    },
    body: {
      flexShrink: 1,
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 10,
    },
    texts: {
      flexShrink: 1,
    },
    // The "label" variant carries a bottom margin meant for form labels.
    title: {
      marginBottom: 0,
    },
    message: {
      marginTop: 1,
      lineHeight: normalize(17),
    },
    divider: {
      width: StyleSheet.hairlineWidth * 2,
      alignSelf: 'stretch',
      marginHorizontal: 12,
      backgroundColor: color.border,
    },
    action: {
      paddingVertical: 6,
    },
    actionText: {
      marginBottom: 0,
      lineHeight: normalize(18),
    },
    pressed: {
      opacity: 0.6,
    },
  });

export default memo(ToastCard);
