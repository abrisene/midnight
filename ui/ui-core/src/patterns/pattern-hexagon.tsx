import React from "react";

import { BasePattern, BasePatternProps } from "./base-pattern";

interface HexagonPatternProps
  extends Omit<BasePatternProps, "patternContent" | "patternId"> {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  sideLength?: number;
}

export const HexagonPattern: React.FC<HexagonPatternProps> = ({
  fill,
  stroke,
  strokeWidth = 1,
  sideLength = 10,
  patternWidth,
  patternHeight,
  ...props
}) => {
  const hexHeight = Math.sqrt(3) * sideLength;
  const hexWidth = 2 * sideLength;
  const hexHalfHeight = hexHeight / 2;
  const hexHalfWidth = sideLength;

  return (
    <BasePattern
      patternId="hexagons"
      patternWidth={hexWidth}
      patternHeight={hexHeight}
      patternContent={
        <polygon
          points={`
            ${hexHalfWidth},0
            ${hexWidth},${hexHalfHeight}
            ${hexHalfWidth},${hexHeight}
            0,${hexHalfHeight}
          `}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      }
      {...props}
    />
  );
};
