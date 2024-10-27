/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { cn } from "@acausal/ui-core";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@acausal/ui-core/collapsible";
import { Label } from "@acausal/ui-core/label";
// import { ChevronDown, ChevronRight } from "lucide-react";
import { ChevronDownIcon, ChevronRightIcon } from "@radix-ui/react-icons";

function sortObjectByKeyOrder(obj: any, keyOrder: string[]) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const head = keyOrder.reduce(
    (acc: any, key) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (obj[key]) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        acc.push([key, obj[key]]);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return acc;
    },
    [] as [string, any][],
  );

  const tail = Object.entries(obj).filter(([key]) => !keyOrder.includes(key));

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment
  return [...head, ...tail];

  // const tail = Object.entries(obj).filter(([key]) => !keyOrder.includes(key));

  // return new Map({ ...head, ...tail }).entries();
}

type JsonRendererProps = Omit<React.HTMLAttributes<HTMLElement>, "children"> & {
  children: any;
  label?: string;
  indent?: number;
  keyOrder?: string[];
  depth?: number;
};

const renderValue = (
  value: any,
  indent: number,
  depth: number,
  keyOrder?: string[],
) => {
  // If the value is an object, render it as a nested JSON viewer
  if (typeof value === "object" && value !== null) {
    return (
      <StaticJSONViewer
        indent={indent + 1}
        depth={depth + 1}
        keyOrder={keyOrder}
      >
        {value}
      </StaticJSONViewer>
    );
  }
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  return <span className="">{String(value)}</span>;
};

export const StaticJSONViewer: React.FC<JsonRendererProps> = ({
  children,
  label,
  indent = 0,
  depth = 0,
  keyOrder = ["id", "type", "name", "description"],
  className,
  ...props
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  // If the children are not an object (leaf node), render the value directly
  if (typeof children !== "object" || children === null) {
    return (
      <div className="mb-2">
        <Label className="font-semibold text-muted-foreground">{label}: </Label>
        {renderValue(children, indent, depth, keyOrder)}
      </div>
    );
  }

  const isArray = Array.isArray(children);
  const isEmpty = isArray
    ? children.length === 0
    : // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      Object.keys(children).length === 0;

  const sortedChildren = isArray
    ? Object.entries(children)
    : sortObjectByKeyOrder(children, keyOrder);

  return (
    <div
      className={cn(`mb-2 ${indent > 0 ? "ml-4" : ""}`, "border-l", className)}
      {...props}
    >
      {label && (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="mb-1 flex flex-col">
            <CollapsibleTrigger
              className={cn(
                "flex items-center rounded p-1",
                isEmpty && "text-muted",
                isEmpty
                  ? "text-muted"
                  : "text-muted-foreground hover:cursor-pointer",
              )}
            >
              {isOpen ? (
                <ChevronDownIcon className={cn(isEmpty && "text-muted")} />
              ) : (
                <ChevronRightIcon className={cn(isEmpty && "text-muted")} />
              )}
              <Label className="font-semibold text-muted-foreground">
                {label}
              </Label>
            </CollapsibleTrigger>

            <CollapsibleContent>
              {sortedChildren.map(([key, value]) => (
                <StaticJSONViewer
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  key={key}
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  label={isArray ? undefined : key}
                  indent={indent + 1}
                >
                  {value}
                </StaticJSONViewer>
              ))}
            </CollapsibleContent>
          </div>
        </Collapsible>
      )}
      {!label && (
        <>
          {sortedChildren.map(([key, value]) => (
            <StaticJSONViewer
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              key={key}
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              label={isArray ? undefined : key}
              indent={indent}
            >
              {value}
            </StaticJSONViewer>
          ))}
        </>
      )}
    </div>
  );
};

export const StaticJSONCodeStyleViewer: React.FC<JsonRendererProps> = ({
  children,
  indent = 0,
  className,
  keyOrder,
  ..._props
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  if (typeof children !== "object" || children === null) {
    return <span className="text-blue-500">{JSON.stringify(children)}</span>;
  }

  const isArray = Array.isArray(children);

  const entries = keyOrder
    ? // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      keyOrder.map((key) => [key, children[key]])
    : // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      Object.entries(children);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-center">
        <CollapsibleTrigger className="rounded p-1 hover:bg-gray-100">
          {isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
        </CollapsibleTrigger>
        <span className="font-mono">{isArray ? "[" : "{"}</span>
      </div>
      <CollapsibleContent>
        <div
          className={cn(className)}
          style={{ marginLeft: `${indent + 20}px` }}
        >
          {entries.map(([key, value], index) => (
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            <div key={key} className="my-1">
              <span className="mr-2 text-gray-500">
                {isArray ? index : `"${key}"`}:
              </span>
              <StaticJSONCodeStyleViewer
                indent={indent + 20}
                keyOrder={keyOrder}
              >
                {value}
              </StaticJSONCodeStyleViewer>
              {index < entries.length - 1 && ","}
            </div>
          ))}
        </div>
      </CollapsibleContent>
      <div style={{ marginLeft: `${indent}px` }}>
        <span className="font-mono">{isArray ? "]" : "}"}</span>
      </div>
    </Collapsible>
  );
};
