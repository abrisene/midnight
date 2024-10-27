import type { VariantProps } from "class-variance-authority";
import React from "react";
import { cva } from "class-variance-authority";

import { cn } from "../utils/cn";

const patternVariants = cva("fill-muted-foreground stroke-muted-foreground", {
  variants: {
    size: {
      sm: "h-24 w-24",
      md: "h-48 w-48",
      lg: "h-96 w-96",
      full: "h-full w-full",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export interface BasePatternProps
  extends React.SVGProps<SVGSVGElement>,
    VariantProps<typeof patternVariants> {
  patternId: string;
  patternContent: React.ReactNode;
  patternWidth?: number;
  patternHeight?: number;
}

export const BasePattern: React.FC<BasePatternProps> = ({
  size,
  className,
  patternId,
  patternContent,
  patternWidth,
  patternHeight,
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn(patternVariants({ size }), className)}
      {...props}
    >
      <defs>
        <pattern
          id={patternId}
          width={patternWidth}
          height={patternHeight}
          patternUnits="userSpaceOnUse"
        >
          {patternContent}
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill={`url(#${patternId})`}
        stroke="none"
      />
    </svg>
  );
};
