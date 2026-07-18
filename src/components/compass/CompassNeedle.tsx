import React, { useEffect, useRef } from 'react';
import Svg, { G, Polygon } from 'react-native-svg';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import { NEEDLE_ANIMATION_DURATION_MS } from '../../constants/config';
import { shortestRotationDelta } from '../../lib/geo/bearing';

const AnimatedG = Animated.createAnimatedComponent(G);

interface CompassNeedleProps {
  size: number;
  /** Target rotation in degrees (0-360), screen-relative — see relativeBearing(). */
  rotationDeg: number;
}

export function CompassNeedle({ size, rotationDeg }: CompassNeedleProps) {
  const displayRotation = useSharedValue(rotationDeg);
  // Tracks the unwrapped rotation actually applied so far (can exceed 0-360),
  // so each new target is reached via the shortest turn rather than snapping
  // back across the 0/360 boundary.
  const appliedRotation = useRef(rotationDeg);

  useEffect(() => {
    const delta = shortestRotationDelta(appliedRotation.current % 360, rotationDeg);
    appliedRotation.current += delta;
    displayRotation.value = withTiming(appliedRotation.current, {
      duration: NEEDLE_ANIMATION_DURATION_MS,
    });
  }, [rotationDeg, displayRotation]);

  const animatedProps = useAnimatedProps(() => ({
    rotation: displayRotation.value,
  }));

  const center = size / 2;
  const tipInset = size * 0.08;
  const tailInset = size * 0.08;
  const halfWidth = size * 0.055;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <AnimatedG origin={`${center}, ${center}`} animatedProps={animatedProps}>
        <Polygon
          points={`${center},${tipInset} ${center - halfWidth},${center} ${center + halfWidth},${center}`}
          fill="#e63946"
        />
        <Polygon
          points={`${center},${size - tailInset} ${center - halfWidth},${center} ${center + halfWidth},${center}`}
          fill="#1d3557"
        />
      </AnimatedG>
    </Svg>
  );
}
