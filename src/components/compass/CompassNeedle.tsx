import React, { useEffect, useRef } from 'react';
import Svg, { Polygon } from 'react-native-svg';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { NEEDLE_ANIMATION_DURATION_MS } from '../../constants/config';
import { shortestRotationDelta } from '../../lib/geo/bearing';

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

  // Rotating a plain View's transform style (rather than an animated prop
  // inside the SVG itself) is what actually works reliably with Reanimated:
  // react-native-svg computes rotation into a native transform matrix during
  // React's normal render pass, which Reanimated's direct prop mutation
  // bypasses, so an animated `rotation` prop on an SVG <G> never visibly
  // updates. Rotating the wrapping View sidesteps that entirely.
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${displayRotation.value}deg` }],
  }));

  const center = size / 2;
  const tipInset = size * 0.08;
  const tailInset = size * 0.08;
  const halfWidth = size * 0.055;

  return (
    <Animated.View style={[{ width: size, height: size }, animatedStyle]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Polygon
          points={`${center},${tipInset} ${center - halfWidth},${center} ${center + halfWidth},${center}`}
          fill="#e63946"
        />
        <Polygon
          points={`${center},${size - tailInset} ${center - halfWidth},${center} ${center + halfWidth},${center}`}
          fill="#1d3557"
        />
      </Svg>
    </Animated.View>
  );
}
