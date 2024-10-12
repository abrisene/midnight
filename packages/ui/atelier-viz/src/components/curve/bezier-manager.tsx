import React, { useState } from "react";
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
  useBezierCurves,
} from "./use-bezier-editor";

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
        <Select
          value={newCurveType}
          onValueChange={(value) =>
            setNewCurveType(value as BezierCurve["type"])
          }
        >
          <SelectTrigger className="capitalize">{newCurveType}</SelectTrigger>
          <SelectContent>
            <SelectItem value="linear">Linear</SelectItem>
            <SelectItem value="bezier">Bezier</SelectItem>
            <SelectItem value="bezier-quadratic">Bezier (Quadratic)</SelectItem>
            {/* Add more curve types as needed */}
          </SelectContent>
        </Select>
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

            <SVGViewer
              width={94}
              height={36}
              // className="rounded-md border border-white/20"
              className="rounded-md bg-muted/50"
            >
              <BezierCurvePath curve={curve} width={94} height={36} />
            </SVGViewer>
            {/* </div> */}
            <Select
              value={curve.type ?? newCurveType}
              onValueChange={(value) => {
                if (!value) return;
                handlers.setType(
                  curve.id,
                  value as NonNullable<BezierCurve["type"]>,
                );
              }}
            >
              <SelectTrigger className="w-24 flex-shrink-0 truncate capitalize">
                {curve.type ?? newCurveType}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="linear">Linear</SelectItem>
                <SelectItem value="bezier">Bezier</SelectItem>
                <SelectItem value="bezier-quadratic">
                  Bezier (Quadratic)
                </SelectItem>
                {/* Add more curve types as needed */}
              </SelectContent>
            </Select>
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
