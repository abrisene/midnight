"use client";

import type { JsonSchema } from "@acausal/utils-json";
import React, { useState } from "react";
import { cn } from "@acausal/ui-core";
import { Button } from "@acausal/ui-core/button";
import { Textarea } from "@acausal/ui-core/textarea";
import { CoerceJSONSchema } from "@acausal/utils-json/zod";
import JSON5 from "json5";

import { PrettyJSON } from "./text-pretty-json";

/* -------------------------------------------------------------------------------------------------
 * TYPES
 * -----------------------------------------------------------------------------------------------*/

interface EditableJSONProps {
  initialData?: JsonSchema;
  onSave?: <T extends JsonSchema = JsonSchema>(data: T) => void;
  className?: string;
  parser?: <T extends JsonSchema = JsonSchema>(value: string) => T;
}
/* -------------------------------------------------------------------------------------------------
 * COMPONENTS
 * -----------------------------------------------------------------------------------------------*/

export const EditableJSON: React.FC<EditableJSONProps> = ({
  initialData,
  onSave,
  className,
  parser = (value: string) => CoerceJSONSchema.parse(value),
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(
    JSON5.stringify(initialData, null, 2),
  );

  const handleEdit = () => {
    setEditedData(JSON5.stringify(initialData, null, 2));
    setIsEditing(true);
  };

  const handleSave = () => {
    try {
      // const parsedData = JSON5.parse(editedData);
      const parsedData = parser(editedData);
      onSave?.(parsedData);
      setIsEditing(false);
    } catch (error) {
      console.error("Invalid JSON5:", error);
      // Handle invalid JSON5, e.g., show an error message
    }
  };

  const handleCancel = () => {
    setEditedData(JSON5.stringify(initialData, null, 2));
    setIsEditing(false);
  };

  return (
    <div className={cn("relative rounded-md border p-2", className)}>
      {isEditing ? (
        <div className="relative h-full">
          <Textarea
            value={editedData}
            onChange={(e) => setEditedData(e.target.value)}
            // onValueChange={(e) => setEditedData(e.target.value)}
            className="text-md h-full w-full overflow-y-auto rounded p-2 font-mono text-white"
          />
          <div className="mt-4 flex justify-end gap-2">
            <Button
              onClick={handleSave}
              variant="outline"
              className="border-green-500"
            >
              Save
            </Button>
            <Button variant="outline" onClick={handleCancel} className="">
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div onClick={handleEdit}>
          <PrettyJSON
            className={cn(
              "decoration-red-500/20 decoration-1 transition-all hover:decoration-dashed",
              className,
            )}
          >
            {initialData}
          </PrettyJSON>
        </div>
      )}
    </div>
  );
};
