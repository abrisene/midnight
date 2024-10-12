import React from "react";
import { cn } from "@acausal/ui-core";

import { BezierCurve } from "../curve/use-bezier-editor";

/* -------------------------------------------------------------------------------------------------
 * CurveHandle
 * -----------------------------------------------------------------------------------------------*/

interface CurveHandleProps extends React.SVGAttributes<SVGCircleElement> {
  curve: BezierCurve;
  pointIndex: number;
  handleRadius: number;
  handleColor: string;
  width: number;
  height: number;
}

export const CurveHandle: React.FC<CurveHandleProps> = ({
  curve,
  width,
  height,
  pointIndex,
  handleRadius,
  handleColor,
  onMouseDown,
  ...props
}) => {
  const point = curve.points[pointIndex];
  if (!point) return null;

  const [x, y] = point;

  return (
    <circle
      className={cn(`opacity-25 hover:opacity-100`)}
      cx={x * width * 0.98}
      cy={y * height * 0.98}
      r={handleRadius}
      fill={handleColor}
      stroke="white"
      strokeWidth="1"
      onMouseDown={onMouseDown}
      {...props}
    />
  );
};
