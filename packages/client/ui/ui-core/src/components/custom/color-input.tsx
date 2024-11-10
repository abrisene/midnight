import * as React from "react";

import { cn } from "../../utils/cn";

export interface ColorInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const ColorInput = React.forwardRef<HTMLInputElement, ColorInputProps>(
  ({ className, value, style, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="color"
        style={{ ...style, background: value as string }}
        className={cn(
          "h-8 w-8 flex-none cursor-pointer overflow-hidden rounded-full border border-input bg-transparent p-0 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    );
  },
);

ColorInput.displayName = "ColorInput";

export { ColorInput };
