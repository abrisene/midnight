/* -------------------------------------------------------------------------------------------------
 * PROPS
 * -----------------------------------------------------------------------------------------------*/

import { cn } from "../../utils/cn";

export type SeparatorLabelProps = React.HTMLAttributes<HTMLDivElement>;

/* -------------------------------------------------------------------------------------------------
 * COMPONENT
 * -----------------------------------------------------------------------------------------------*/

export function SeparatorLabel({
  children,
  className,
  ...props
}: SeparatorLabelProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-background px-2 text-muted-foreground">
          {children}
        </span>
      </div>
    </div>
  );
}
