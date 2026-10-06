import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  type SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import Svg, { G, Path } from 'react-native-svg';
import { type PieceDef, SHADOW_OFFSET } from './geometry';

/** Max shiver offset (viewBox units) and rotation (deg) for the most displaced pieces. */
const SHIVER_SHIFT = 1.4;
const SHIVER_ROTATE = 2.5;

type Props = {
  piece: PieceDef;
  scale: number;
  fill: string;
  shade: string;
  progress: SharedValue<number>;
  shiver: SharedValue<number>;
};

const WifiPiece = ({ piece, scale, fill, shade, progress, shiver }: Props) => {
  const { d, box, origin, dx, dy, rot, strength, isShard } = piece;

  const animatedStyle = useAnimatedStyle(() => {
    const b = progress.value;
    const s = shiver.value * strength * b;
    return {
      opacity: isShard ? b : 1,
      transform: [
        { translateX: (dx * b + s * SHIVER_SHIFT) * scale },
        { translateY: (dy * b - s * SHIVER_SHIFT * 0.5) * scale },
        { rotate: `${rot * b + s * SHIVER_ROTATE}deg` },
      ],
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      renderToHardwareTextureAndroid
      shouldRasterizeIOS
      style={[
        styles.piece,
        {
          left: box.x * scale,
          top: box.y * scale,
          width: box.w * scale,
          height: box.h * scale,
          transformOrigin: [
            (origin[0] - box.x) * scale,
            (origin[1] - box.y) * scale,
            0,
          ],
        },
        animatedStyle,
      ]}
    >
      <Svg
        width={box.w * scale}
        height={box.h * scale}
        viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`}
      >
        <G transform={`translate(0 ${SHADOW_OFFSET})`}>
          <Path d={d} fill={shade} />
        </G>
        <Path d={d} fill={fill} />
      </Svg>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  piece: {
    position: 'absolute',
  },
});

export default memo(WifiPiece);
