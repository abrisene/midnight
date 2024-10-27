import React from "react";

import { cn } from "../../utils/cn";

/* -------------------------------------------------------------------------------------------------
 * RADIAL MENU
 * -----------------------------------------------------------------------------------------------*/

interface RadialMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  radius?: number;
  arcOffset?: number;
  arcStart?: number;
  arcEnd?: number;
  childOffset?: number;
  children?: React.ReactNode;
}

const RadialMenu = React.forwardRef<HTMLDivElement, RadialMenuProps>(
  (
    {
      radius = 125,
      arcStart = 0,
      arcEnd = 180,
      arcOffset = 90,
      childOffset = -60,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const numChildren = React.Children.count(children);
    const arcLength = arcStart - arcEnd;
    const slice = arcLength / numChildren;

    const childrenWithPosition = React.Children.map(
      children,
      (child, index) => {
        const angle = arcStart + slice * index + arcOffset;
        const angleRad = (angle * Math.PI) / 180;
        const x = Math.cos(angleRad) * (radius + childOffset);
        const y = Math.sin(angleRad) * (radius + childOffset);

        return (
          <div
            className="absolute"
            style={{
              left: `${50 + x}%`,
              top: `${50 - y}%`,
              transform: "translate(-50%, -50%)",
            }}
            {...props}
          >
            {child}
          </div>
        );
      },
    );

    return (
      <div
        ref={ref}
        className={cn("relative rounded-full", className)}
        style={{
          height: `${radius}px`,
          width: `${radius}px`,
        }}
      >
        {childrenWithPosition}
      </div>
    );
  },
);

export default RadialMenu;

/* -------------------------------------------------------------------------------------------------
 * EXAMPLE CONTEXT MENU
 * -----------------------------------------------------------------------------------------------*/

/*
  <div className="relative size-full">
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="size-full border border-dashed border-muted"></div>
      </ContextMenuTrigger>

      <ContextMenuContent
        className="size-20 overflow-visible border-none bg-transparent"
        alignOffset={180}
        asChild
      >
        <div className="size-20">
          <RadialMenu className="absolute -translate-x-1/2 -translate-y-1/2 border border-muted">
            <div className="z-4 align-center flex size-10 cursor-pointer items-center rounded-full border border-2 border-red-500 p-2 text-center transition-all hover:z-10 hover:scale-105 hover:saturate-200">
              1
            </div>
            <div className="z-3 align-center flex size-10 cursor-pointer items-center rounded-full border border-2 border-blue-500 p-2 text-center transition-all hover:z-10 hover:scale-105 hover:saturate-200">
              2
            </div>
            <div className="z-2 align-center flex size-10 cursor-pointer items-center rounded-full border border-2 border-green-500 p-2 text-center transition-all hover:z-10 hover:scale-105 hover:saturate-200">
              3
            </div>
            <div className="z-1 align-center flex size-10 cursor-pointer items-center rounded-full border border-2 border-yellow-500 p-2 text-center transition-all hover:z-10 hover:scale-105 hover:saturate-200">
              4
            </div>
          </RadialMenu>
        </div>
      </ContextMenuContent>
    </ContextMenu>
  </div>
*/
