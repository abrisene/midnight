import React from "react";

import { BasePattern, BasePatternProps } from "./base-pattern";

interface GridPatternProps
  extends Omit<BasePatternProps, "patternContent" | "patternId"> {
  stroke?: string;
  strokeWidth?: number;
  gap: number;
}

export const GridPattern: React.FC<GridPatternProps> = ({
  stroke,
  strokeWidth,
  gap,
  patternWidth,
  patternHeight,
  ...props
}) => {
  return (
    <BasePattern
      patternId="grid"
      patternWidth={gap}
      patternHeight={gap}
      patternContent={
        <path
          d={`M ${gap} 0 L 0 0 0 ${gap}`}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      }
      {...props}
    />
  );
};
