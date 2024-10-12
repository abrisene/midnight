import React, { useMemo, useRef } from "react";
import { cn } from "@acausal/ui-core";
import * as d3 from "d3";

import { BezierCurve } from "../curve/use-bezier-editor";

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
  const pathRef = useRef<SVGPathElement>(null);

  const { d } = useMemo(() => {
    const line = d3
      .line<[number, number]>()
      .x((d) => d[0] * width * 0.98)
      .y((d) => d[1] * height * 0.98)
      .curve(d3.curveCatmullRom.alpha(0.5));

    return { line, d: line([...curve.points]) };
  }, [curve, width, height]);

  if (!d) return null;
  return (
    <path
      ref={pathRef}
      className={cn("stroke-2", curve.className)}
      stroke={curve.color}
      d={d ?? ""}
      fill="none"
      strokeWidth="1"
      {...props}
    />
  );
}
