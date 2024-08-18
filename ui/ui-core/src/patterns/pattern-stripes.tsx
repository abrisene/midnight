import React from "react";

import { BasePattern, BasePatternProps } from "./base-pattern";

interface DiagonalStripesPatternProps
  extends Omit<BasePatternProps, "patternContent" | "patternId"> {
  stroke: string;
  strokeWidth: number;
  gap: number;
}

export const DiagonalStripesPattern: React.FC<DiagonalStripesPatternProps> = ({
  stroke,
  strokeWidth,
  gap,
  patternWidth,
  patternHeight,
  ...props
}) => {
  return (
    <BasePattern
      patternId="diagonalStripes"
      patternWidth={gap}
      patternHeight={gap}
      patternContent={
        <line
          x1="0"
          y1="0"
          x2="0"
          y2={gap}
          // stroke={stroke}
          strokeWidth={strokeWidth}
        />
      }
      patternTransform="rotate(45)"
      {...props}
    />
  );
};
