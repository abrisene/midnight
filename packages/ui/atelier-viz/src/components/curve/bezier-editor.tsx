import React, { forwardRef, useCallback } from "react";
import { useMergedRef } from "@acausal/hooks";
import { cn } from "@acausal/ui-core";

import { BezierCurvePath } from "../svg/svg-bezier";
import { SVGViewer } from "../svg/svg-elements";
import { CurveHandle } from "../svg/svg-handle";
import { BezierCurve, useBezierCurves } from "./use-bezier-editor";

/* -------------------------------------------------------------------------------------------------
 * BezierCurveEditor
 * -----------------------------------------------------------------------------------------------*/

interface BezierCurveEditorProps {
  strokeColor?: string;
  handleColor?: string;
  lineWidth?: number;
  handleRadius?: number;
  onCurvesChange?: (curves: BezierCurve[]) => void;
}

export const BezierCurveEditor = forwardRef<
  HTMLDivElement,
  React.HtmlHTMLAttributes<HTMLDivElement> & BezierCurveEditorProps
>(
  (
    {
      strokeColor = "stroke-red-500",
      handleColor = "transparent",
      lineWidth = 2,
      handleRadius = 8,
      onCurvesChange,
      className,
      ...props
    },
    ref,
  ) => {
    const { curves, ref: containerRef, width, height } = useBezierCurves();
    const mergedRef = useMergedRef(ref, containerRef);

    return (
      <div
        ref={mergedRef}
        className={cn(`relative size-full bg-muted/50`, className)}
        {...props}
      >
        <SVGViewer width={width} height={height}>
          {curves.map((curve) => (
            <BezierCurvePath
              key={curve.id}
              curve={curve}
              width={width}
              height={height}
            />
          ))}
          <BezierCurveHandles
            curves={curves}
            handleColor={handleColor}
            handleRadius={handleRadius}
            width={width}
            height={height}
          />
        </SVGViewer>
        <div className="absolute bottom-1 right-1 font-mono text-xs text-muted">
          x. {width} y. {height}
        </div>
      </div>
    );
  },
);

/* -------------------------------------------------------------------------------------------------
 * BezierCurveHandles
 * -----------------------------------------------------------------------------------------------*/

interface BezierCurveHandlesProps {
  curves: BezierCurve[];
  handleColor: string;
  handleRadius: number;
  width: number;
  height: number;
}

export const BezierCurveHandles: React.FC<BezierCurveHandlesProps> = ({
  curves,
  handleColor,
  handleRadius,
  width,
  height,
}) => {
  const { setSelectedCurveIndex, setDraggingPointIndex } = useBezierCurves();

  const handleMouseDown = useCallback(
    (curveIndex: number, pointIndex: number) => {
      setSelectedCurveIndex(curveIndex);
      setDraggingPointIndex(pointIndex);
    },
    [setSelectedCurveIndex, setDraggingPointIndex],
  );

  return (
    <>
      {curves.map((curve, curveIndex) => (
        <g key={`${curve.id}-handles`}>
          {curve.points.map((point, pointIndex) => (
            <CurveHandle
              key={`${curve.id}-${pointIndex}`}
              curve={curve}
              pointIndex={pointIndex}
              handleRadius={handleRadius}
              handleColor={handleColor}
              onMouseDown={() => handleMouseDown(curveIndex, pointIndex)}
              width={width}
              height={height}
            />
          ))}
        </g>
      ))}
    </>
  );
};
