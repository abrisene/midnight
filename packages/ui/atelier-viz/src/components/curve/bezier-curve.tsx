import React, { useMemo, useRef } from "react";
import { curveCatmullRom } from "@visx/curve";
import { Group } from "@visx/group";
import { LinePath } from "@visx/shape";

import { BezierCurve } from "./use-bezier-editor";

/* -------------------------------------------------------------------------------------------------
 * BezierCurvePath
 * -----------------------------------------------------------------------------------------------*/

interface BezierCurvePathProps extends React.SVGAttributes<SVGPathElement> {
  curve: BezierCurve;
  width: number;
  height: number;
}
export function BezierCurvePath({
  curve,
  width,
  height,
  ...props
}: BezierCurvePathProps) {
  const pathRef = useRef(null);

  const points = useMemo(
    () =>
      curve.points.map((p) => ({
        x: p[0] * width * 0.98,
        y: p[1] * height * 0.98,
      })),
    [curve.points, width, height],
  );

  return (
    <Group>
      <LinePath
        data={points}
        x={(d) => d.x}
        y={(d) => d.y}
        curve={curveCatmullRom}
        stroke={curve.color}
        strokeWidth={1}
        fill="none"
        innerRef={pathRef}
        {...props}
      />
    </Group>
  );
}

// SVGViewer remains mostly the same, ensure it uses Visx components if needed
export const SVGViewer = React.forwardRef<
  SVGSVGElement,
  {
    children: React.ReactNode;
    className: string;
    width: number;
    height: number;
    [propName: string]: any;
  }
>(({ children, className, width, height, ...props }, ref) => {
  return (
    <svg
      ref={ref}
      className={className}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      {...props}
    >
      {children}
    </svg>
  );
});
