import React from 'react';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';

interface CompassDialProps {
  size: number;
}

const CARDINALS = [
  { label: 'N', angle: 0 },
  { label: 'E', angle: 90 },
  { label: 'S', angle: 180 },
  { label: 'W', angle: 270 },
];

export function CompassDial({ size }: CompassDialProps) {
  const center = size / 2;
  const radius = size * 0.45;
  const tickInset = size * 0.05;

  const ticks = [];
  for (let angle = 0; angle < 360; angle += 30) {
    const rad = (angle * Math.PI) / 180;
    const outer = { x: center + radius * Math.sin(rad), y: center - radius * Math.cos(rad) };
    const inner = {
      x: center + (radius - tickInset) * Math.sin(rad),
      y: center - (radius - tickInset) * Math.cos(rad),
    };
    ticks.push(
      <Line
        key={angle}
        x1={inner.x}
        y1={inner.y}
        x2={outer.x}
        y2={outer.y}
        stroke="#999"
        strokeWidth={angle % 90 === 0 ? 2 : 1}
      />
    );
  }

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Circle cx={center} cy={center} r={radius} stroke="#333" strokeWidth={2} fill="none" />
      {ticks}
      {CARDINALS.map(({ label, angle }) => {
        const rad = (angle * Math.PI) / 180;
        const labelRadius = radius - size * 0.12;
        const x = center + labelRadius * Math.sin(rad);
        const y = center - labelRadius * Math.cos(rad);
        return (
          <SvgText
            key={label}
            x={x}
            y={y}
            fontSize={size * 0.08}
            fontWeight="bold"
            fill="#333"
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            {label}
          </SvgText>
        );
      })}
    </Svg>
  );
}
