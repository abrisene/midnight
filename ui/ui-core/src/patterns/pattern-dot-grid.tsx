import React from "react";

import { BasePattern, BasePatternProps } from "./base-pattern";

interface DotGridPatternProps
  extends Omit<BasePatternProps, "patternContent" | "patternId"> {
  fill?: string;
  radius: number;
  gap: number;
}

export const DotGridPattern: React.FC<DotGridPatternProps> = ({
  fill,
  radius,
  gap,
  patternHeight,
  patternWidth,
  ...props
}) => {
  return (
    <BasePattern
      patternId="dotGrid"
      patternWidth={gap}
      patternHeight={gap}
      patternContent={<circle cx={radius} cy={radius} r={radius} fill={fill} />}
      {...props}
    />
  );
};
