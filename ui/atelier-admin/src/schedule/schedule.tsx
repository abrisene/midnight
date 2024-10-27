import React, { useEffect, useState } from "react";
import { Button } from "@acausal/ui-core/button";

import type { Schedule } from "./types";

import { ScheduleItem } from "./schedule-item";
import { ScheduleTimeline } from "./schedule-timeline";

interface ScheduleManagerProps {
  initialSchedules?: Schedule[];
  onSchedulesChange?: (schedules: Schedule[]) => void;
}

export function ScheduleManager({
  initialSchedules = [],
  onSchedulesChange,
}: ScheduleManagerProps) {
  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules);

  useEffect(() => {
    if (initialSchedules.length === 0) {
      // Preset schedules
      const presetSchedules: Schedule[] = [
        {
          id: "project-1",
          type: "calendar",
          name: "Project Alpha",
          startTime: "2024-08-21T09:00",
          endTime: "2024-08-21T17:00",
          children: [
            {
              id: "project-1-phase-1",
              type: "vector",
              name: "Phase 1",
              offset: 0,
              duration: 120,
              children: [],
            },
            {
              id: "project-1-phase-2",
              type: "vector",
              name: "Phase 2",
              offset: 120,
              duration: 180,
              children: [],
            },
          ],
        },
        {
          id: "project-2",
          type: "calendar",
          name: "Project Beta",
          startTime: "2024-08-21T10:30",
          endTime: "2024-08-21T16:30",
          children: [
            {
              id: "project-2-task-1",
              type: "vector",
              name: "Task 1",
              offset: 30,
              duration: 90,
              children: [],
            },
          ],
        },
      ];
      setSchedules(presetSchedules);
    }
  }, [initialSchedules]);

  useEffect(() => {
    onSchedulesChange?.(schedules);
  }, [schedules, onSchedulesChange]);

  const addSchedule = (type: "calendar" | "vector") => {
    const newSchedule: Schedule =
      type === "calendar"
        ? {
            id: `schedule-${schedules.length}`,
            type: "calendar",
            name: "New Calendar Schedule",
            startTime: new Date().toISOString().slice(0, 16),
            children: [],
          }
        : {
            id: `schedule-${schedules.length}`,
            type: "vector",
            name: "New Vector Schedule",
            duration: 60,
            children: [],
          };
    setSchedules([...schedules, newSchedule]);
  };

  const handleUpdateSchedule = (updatedSchedule: Schedule) => {
    setSchedules(
      schedules.map((s) => (s.id === updatedSchedule.id ? updatedSchedule : s)),
    );
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules(schedules.filter((s) => s.id !== id));
  };

  const handleAddChildSchedule = (parentId: string) => {
    setSchedules(
      schedules.map((s) =>
        s.id === parentId
          ? {
              ...s,
              children: [
                ...s.children,
                {
                  id: `${s.id}-${s.children.length}`,
                  type: "calendar",
                  name: "New Child Schedule",
                  startTime: new Date().toISOString().slice(0, 16),
                  children: [],
                },
              ],
            }
          : s,
      ),
    );
  };

  return (
    <div className="p-4">
      <h2 className="mb-4 text-2xl font-bold">Schedule Manager</h2>
      <div className="mb-4">
        <Button onClick={() => addSchedule("calendar")} className="mr-2">
          Add Calendar Schedule
        </Button>
        <Button onClick={() => addSchedule("vector")}>
          Add Vector Schedule
        </Button>
      </div>
      {schedules.map((schedule) => (
        <ScheduleItem
          key={schedule.id}
          schedule={schedule}
          depth={0}
          onUpdate={(updatedSchedule) =>
            setSchedules(
              schedules.map((s) =>
                s.id === updatedSchedule.id ? updatedSchedule : s,
              ),
            )
          }
          onDelete={() =>
            setSchedules(schedules.filter((s) => s.id !== schedule.id))
          }
          onAddChild={() =>
            setSchedules(
              schedules.map((s) =>
                s.id === schedule.id
                  ? {
                      ...s,
                      children: [
                        ...s.children,
                        {
                          id: `${s.id}-${s.children.length}`,
                          type: "calendar",
                          name: "New Child Schedule",
                          startTime: new Date().toISOString().slice(0, 16),
                          children: [],
                        },
                      ],
                    }
                  : s,
              ),
            )
          }
        />
      ))}
      <ScheduleTimeline
        schedules={schedules}
        onUpdateSchedule={(updatedSchedule) => {
          setSchedules(
            schedules.map((s) =>
              s.id === updatedSchedule.id ? updatedSchedule : s,
            ),
          );
        }}
      />
    </div>
  );
}
