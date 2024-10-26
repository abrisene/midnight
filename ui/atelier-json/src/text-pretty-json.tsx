import { useMemo, useState } from "react";
import { cn } from "@acausal/ui-core";
import { beautifyJSON } from "@acausal/utils-json/beautify";

/* -------------------------------------------------------------------------------------------------
 * PROPS
 * -----------------------------------------------------------------------------------------------*/

interface PrettyJSONProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  children?: unknown;
  // replacer: (key: string, value: unknown) => unknown;
  space?: number;
  lineLength?: number;
  showError?: boolean;
  as?: "pre" | "code" | "div" | "span" | "p" | "section" | "article" | "aside";
}

/* -------------------------------------------------------------------------------------------------
 * COMPONENTS
 * -----------------------------------------------------------------------------------------------*/

export function PrettyJSON({
  className,
  children,
  // replacer,
  space = 2,
  lineLength = 80,
  as = "p",
  showError = true,
  ...props
}: PrettyJSONProps) {
  const [isError, setIsError] = useState(false);
  const Comp = as;
  const json = useMemo(() => {
    try {
      const result = beautifyJSON(children, null, space, lineLength);
      setIsError(false);
      return result;
    } catch (error) {
      console.log(`Error beautifying JSON: ${error}`, children);
      setIsError(true);
      if (error instanceof Error) {
        return beautifyJSON(error.message);
      }
      return beautifyJSON(error);
    }
  }, [children, space, lineLength]);
  return (
    <Comp
      className={cn(
        "whitespace-pre-wrap font-mono",
        showError && isError && "text-red-800",
        className,
      )}
      {...props}
    >
      {json}
    </Comp>
  );
}
