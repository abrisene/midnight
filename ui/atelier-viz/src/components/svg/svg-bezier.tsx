import React, { useCallback, useMemo, useRef } from "react";
import { cn } from "@acausal/ui-core";
import * as d3 from "d3-shape";

import { BezierCurve, getCurveFunction } from "../curve/use-bezier-editor";

/* -------------------------------------------------------------------------------------------------
 * BezierCurvePath
 * -----------------------------------------------------------------------------------------------*/

interface BezierCurvePathProps extends React.SVGAttributes<SVGPathElement> {
  curve: BezierCurve;
  width: number;
  height: number;
  onAddPoint?: (curveId: string, x: number, y: number) => void;
}

export function BezierCurvePath({
  curve,
  width,
  height,
  onAddPoint,
  ...props
}: BezierCurvePathProps) {
  const pathRef = useRef<SVGPathElement>(null);

  const { d } = useMemo(() => {
    const fn = getCurveFunction(curve.type || "linear");
    const line = d3
      .line<[number, number]>()
      .x((d) => d[0] * width * 0.98)
      .y((d) => d[1] * height * 0.98)
      .curve(fn);

    return { line, d: line([...curve.points]) };
  }, [curve, width, height]);

  const handleClick = useCallback(
    (event: React.MouseEvent<SVGPathElement>) => {
      if (onAddPoint) {
        const svgRect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - svgRect.left) / svgRect.width) * 0.98;
        const y = ((event.clientY - svgRect.top) / svgRect.height) * 0.98;
        onAddPoint(curve.id, x, y);
      }
    },
    [curve.id, onAddPoint],
  );

  if (!d) return null;
  return (
    <path
      ref={pathRef}
      className={cn("stroke-2 hover:stroke-4", curve.className)}
      stroke={curve.color}
      d={d ?? ""}
      fill="none"
      strokeWidth="1"
      onClick={handleClick}
      {...props}
    />
  );
}
