import React, { useState } from "react";
import { Button } from "@acausal/ui-core/button";

import type { Schedule } from "./types";

interface ScheduleItemProps {
  schedule: Schedule;
  depth: number;
  onUpdate: (updatedSchedule: Schedule) => void;
  onDelete: () => void;
  onAddChild: () => void;
}

export function ScheduleItem({
  schedule,
  depth,
  onUpdate,
  onDelete,
  onAddChild,
}: ScheduleItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(schedule.name);

  const handleSave = () => {
    onUpdate({ ...schedule, name });
    setIsEditing(false);
  };

  return (
    <div className="mb-4 rounded border p-2" style={{ marginLeft: depth * 20 }}>
      {isEditing ? (
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-2 rounded border p-1"
          />
          <Button onClick={handleSave} className="mr-2">
            Save
          </Button>
          <Button onClick={() => setIsEditing(false)}>Cancel</Button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <span>{schedule.name}</span>
          <div>
            <Button onClick={() => setIsEditing(true)} className="mr-2">
              Edit
            </Button>
            <Button onClick={onDelete} className="mr-2">
              Delete
            </Button>
            <Button onClick={onAddChild}>Add Child</Button>
          </div>
        </div>
      )}
      {schedule.children.map((child) => (
        <ScheduleItem
          key={child.id}
          schedule={child}
          depth={depth + 1}
          onUpdate={(updatedChild) =>
            onUpdate({
              ...schedule,
              children: schedule.children.map((c) =>
                c.id === updatedChild.id ? updatedChild : c,
              ),
            })
          }
          onDelete={() =>
            onUpdate({
              ...schedule,
              children: schedule.children.filter((c) => c.id !== child.id),
            })
          }
          onAddChild={() =>
            onUpdate({
              ...schedule,
              children: [
                ...schedule.children,
                {
                  id: `${child.id}-${child.children.length}`,
                  type: "calendar",
                  name: "New Child Schedule",
                  startTime: new Date().toISOString().slice(0, 16),
                  children: [],
                },
              ],
            })
          }
        />
      ))}
    </div>
  );
}
