import React, { useState } from "react";
import { cn } from "@acausal/ui-core";
import { Button } from "@acausal/ui-core/button";
import { ColorInput } from "@acausal/ui-core/color-input";
import { PlusCircledIcon } from "@acausal/ui-core/icons";
import { Input } from "@acausal/ui-core/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@acausal/ui-core/select";
import { Trash } from "@phosphor-icons/react/Trash";

import { BezierCurvePath } from "../svg/svg-bezier";
import { SVGViewer } from "../svg/svg-elements";
import {
  BezierCurve,
  BezierCurvesCallbacks,
  CURVE_OPTIONS,
  CurveType,
  DEFAULT_CURVE,
  useBezierCurves,
} from "./use-bezier-editor";

/* -------------------------------------------------------------------------------------------------
 * BezierCurveTypeSelect
 * -----------------------------------------------------------------------------------------------*/

interface BezierCurveTypeSelectProps
  extends React.ComponentProps<typeof Select> {
  value: BezierCurve["type"];
  className?: string;
  curve?: BezierCurve;
  onChange: (type: BezierCurve["type"]) => void;
}

export const BezierCurveTypeSelect: React.FC<BezierCurveTypeSelectProps> = ({
  value,
  onChange,
  className,
  curve = DEFAULT_CURVE,
  ...props
}) => {
  return (
    <Select
      value={value}
      onValueChange={(value) => onChange(value as BezierCurve["type"])}
      {...props}
    >
      <SelectTrigger className={cn("flex-initial capitalize", className)}>
        <div className="flex-shrink-0">{value}</div>
        {curve && (
          <SVGViewer
            width={100}
            height={45}
            className="flex-initial flex-shrink-0"
          >
            <BezierCurvePath
              curve={{ ...curve, type: value as BezierCurve["type"] }}
              width={100}
              height={45}
            />
          </SVGViewer>
        )}
      </SelectTrigger>
      <SelectContent>
        {Object.entries(CURVE_OPTIONS).map(([value, label]) => (
          <SelectItem key={value} value={value} className="capitalize">
            <div className="justify-apart flex w-full items-center gap-2">
              <div className="flex-shrink-0">{label}</div>
              {curve && (
                <SVGViewer width={94} height={36}>
                  <BezierCurvePath
                    curve={{ ...curve, type: value as BezierCurve["type"] }}
                    width={94}
                    height={36}
                  />
                </SVGViewer>
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

/* -------------------------------------------------------------------------------------------------
 * BezierCurvesManager
 * -----------------------------------------------------------------------------------------------*/

interface BezierCurvesManagerProps extends Partial<BezierCurvesCallbacks> {}

export const BezierCurvesManager: React.FC<BezierCurvesManagerProps> = ({
  onCurveCreated,
  onCurveDeleted,
  onCurvesChanged,
}) => {
  const { curves, setCurves, ...handlers } = useBezierCurves({
    onCurvesChanged,
    onCurveCreated,
    onCurveDeleted,
  });
  const [newCurveColor, setNewCurveColor] = useState("#800000");
  const [newCurveType, setNewCurveType] =
    useState<BezierCurve["type"]>("linear");
  const [newCurveId, setNewCurveId] = useState("");

  const handleAddCurve = () => {
    const newCurve: BezierCurve = {
      id: newCurveId || `curve-${curves.length + 1}`,
      color: newCurveColor,
      type: newCurveType,
      points: [
        [0, 0.75],
        [0.25, 0.5],
        [0.75, 0.5],
        [1, 0.75],
      ],
    };
    handlers.create(newCurve);
  };

  return (
    <div className="relative flex flex-col gap-4 divide-y p-2">
      <div className="flex items-center gap-4">
        <ColorInput
          className="aspect-square"
          type="color"
          value={newCurveColor}
          onChange={(e) => setNewCurveColor(e.target.value)}
        />
        <BezierCurveTypeSelect
          value={newCurveType}
          onChange={(value) => setNewCurveType(CurveType.parse(value))}
        />
        <Input
          type="text"
          placeholder="Curve ID"
          value={newCurveId}
          onChange={(e) => setNewCurveId(e.target.value)}
        />
        <Button
          onClick={handleAddCurve}
          className="p-2 text-sky-700 dark:text-sky-300"
          variant="ghost"
          size="icon"
        >
          <PlusCircledIcon className="size-6" />
        </Button>
      </div>
      <ul className="divide-y">
        {curves.map((curve) => (
          <li
            key={curve.id}
            className="relative flex w-full items-center justify-between gap-2 py-2"
          >
            <ColorInput
              className="aspect-square"
              type="color"
              value={curve.color}
              onChange={(e) => handlers.setColor(curve.id, e.target.value)}
            />
            <div className="ml-4 h-full flex-initial grow items-center align-middle text-sm">
              {curve.id}
            </div>

            {/* <SVGViewer
              width={94}
              height={36}
              className="rounded-md bg-muted/50"
            >
              <BezierCurvePath curve={curve} width={94} height={36} />
            </SVGViewer> */}
            <BezierCurveTypeSelect
              value={curve.type ?? newCurveType}
              curve={curve}
              onChange={(value) =>
                handlers.setType(curve.id, CurveType.parse(value))
              }
            />

            <Button
              className="p-2 text-orange-700 dark:text-orange-300"
              variant="ghost"
              size="icon"
              onClick={() => handlers.remove(curve.id)}
            >
              <Trash className="size-6" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};
