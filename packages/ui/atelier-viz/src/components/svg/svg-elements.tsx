import React, { forwardRef } from "react";
import { cn } from "@acausal/ui-core";

/* -------------------------------------------------------------------------------------------------
 * SVGViewer
 * -----------------------------------------------------------------------------------------------*/

interface SVGViewerProps {
  children: React.ReactNode;
  width: number;
  height: number;
}
export const SVGViewer = forwardRef<
  SVGSVGElement,
  React.SVGAttributes<SVGSVGElement> & SVGViewerProps
>(({ children, className, width, height, ...props }, ref) => {
  // const ratio = width / height;
  return (
    <svg
      ref={ref}
      className={cn(className)}
      width={width}
      height={height}
      viewBox={`-20 -20 ${width + 40} ${height + 40}`}
      preserveAspectRatio="none"
      {...props}
    >
      {children}
    </svg>
  );
});
