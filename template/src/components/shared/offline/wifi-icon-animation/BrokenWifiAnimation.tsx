import React, { memo, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { G, Path } from 'react-native-svg';
import { useAppTheme } from '@/context/ThemeContext';
import { PIECES, SHADOW_OFFSET, SOLID_PIECES, VIEWBOX } from './geometry';
import WifiPiece from './WifiPiece';

const HOLD_WHOLE = 700;
const BREAK_DURATION = 650;
export const BREAK_TOTAL_MS = HOLD_WHOLE + BREAK_DURATION;

/** Pause between shiver bursts once the icon is broken. */
const SHIVER_REST = 1800;
const SHIVER_STEP = 70;

type Props = {
  size: number;
  /** Pauses the looping shiver (e.g. app in background or screen unfocused). */
  active?: boolean;
};

const BrokenWifiAnimation = ({ size, active = true }: Props) => {
  const { color } = useAppTheme();
  const progress = useSharedValue(0);
  const shiver = useSharedValue(0);
  const scale = size / VIEWBOX;

  useEffect(() => {
    progress.value = withDelay(
      HOLD_WHOLE,
      withTiming(1, {
        duration: BREAK_DURATION,
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      }),
    );
  }, [progress]);

  useEffect(() => {
    if (!active) {
      // Assigning a plain value cancels the running loop.
      shiver.value = 0;
      return;
    }
    shiver.value = withDelay(
      BREAK_TOTAL_MS,
      withRepeat(
        withSequence(
          withDelay(SHIVER_REST, withTiming(1, { duration: SHIVER_STEP })),
          withTiming(-1, { duration: SHIVER_STEP * 1.5 }),
          withTiming(0.7, { duration: SHIVER_STEP * 1.5 }),
          withTiming(-0.4, { duration: SHIVER_STEP * 1.5 }),
          withTiming(0, { duration: SHIVER_STEP }),
        ),
        -1,
        false,
      ),
    );
  }, [active, shiver]);

  // Before the break, one static SVG draws the whole icon (all shadows under all faces,
  // so no seams); the individual pieces take over the moment it starts breaking.
  const wholeStyle = useAnimatedStyle(() => ({
    opacity: progress.value > 0 ? 0 : 1,
  }));
  const piecesStyle = useAnimatedStyle(() => ({
    opacity: progress.value > 0 ? 1 : 0,
  }));

  return (
    <View style={{ width: size, height: size }} accessibilityElementsHidden>
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, wholeStyle]}
      >
        <Svg width={size} height={size} viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}>
          <G transform={`translate(0 ${SHADOW_OFFSET})`}>
            {SOLID_PIECES.map((piece, index) => (
              <Path key={index} d={piece.d} fill={color.primary_deep} />
            ))}
          </G>
          {SOLID_PIECES.map((piece, index) => (
            <Path key={index} d={piece.d} fill={color.primary} />
          ))}
        </Svg>
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, piecesStyle]}
      >
        {PIECES.map((piece, index) => (
          <WifiPiece
            key={index}
            piece={piece}
            scale={scale}
            fill={piece.isShard ? color.primary_accent : color.primary}
            shade={color.primary_deep}
            progress={progress}
            shiver={shiver}
          />
        ))}
      </Animated.View>
    </View>
  );
};

export default memo(BrokenWifiAnimation);
