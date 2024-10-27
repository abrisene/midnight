import { useEffect, useRef, useState } from "react";
import { Select } from "@acausal/ui-core/select";

import type { Schedule } from "./types";

export function ScheduleTimeline({
  schedules,
  onUpdateSchedule,
}: {
  schedules: Schedule[];
  onUpdateSchedule: (updatedSchedule: Schedule) => void;
}) {
  const [timelineData, setTimelineData] = useState<
    { id: string; start: number; end: number; name: string; color: string }[]
  >([]);
  const [timeUnit, setTimeUnit] = useState<"minutes" | "hours" | "days">(
    "hours",
  );
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedEdge, setDraggedEdge] = useState<{
    id: string;
    edge: "start" | "end";
  } | null>(null);

  const colors = ["#3498db", "#2ecc71", "#e74c3c", "#f39c12", "#9b59b6"];

  useEffect(() => {
    const flattenSchedules = (
      schedule: Schedule,
      parentStart = 0,
      depth = 0,
    ): {
      id: string;
      start: number;
      end: number;
      name: string;
      color: string;
    }[] => {
      let result: {
        id: string;
        start: number;
        end: number;
        name: string;
        color: string;
      }[] = [];

      if (schedule.type === "calendar") {
        const start = new Date(schedule.startTime).getTime();
        const end = schedule.endTime
          ? new Date(schedule.endTime).getTime()
          : start + 3600000; // Default to 1 hour if no end time
        result.push({
          id: schedule.id,
          start,
          end,
          name: schedule.name,
          color: colors[depth % colors.length] ?? "#000000",
        });
        parentStart = start;
      } else if (schedule.type === "vector") {
        const start = parentStart + (schedule.offset || 0) * 60000; // Convert minutes to milliseconds
        const end = start + schedule.duration * 60000;
        result.push({
          id: schedule.id,
          start,
          end,
          name: schedule.name,
          color: colors[depth % colors.length] ?? "#000000",
        });
      }

      schedule.children.forEach((child) => {
        result = result.concat(flattenSchedules(child, parentStart, depth + 1));
      });

      return result;
    };

    const flatSchedules = schedules.flatMap((schedule) =>
      flattenSchedules(schedule),
    );
    setTimelineData(flatSchedules);
  }, [schedules]);

  const minTime = Math.min(...timelineData.map((d) => d.start));
  const maxTime = Math.max(...timelineData.map((d) => d.end));
  const timeRange = maxTime - minTime;

  const formatTime = (time: number) => {
    const date = new Date(time);
    switch (timeUnit) {
      case "minutes":
        return date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      case "hours":
        return date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      case "days":
        return date.toLocaleDateString();
    }
  };

  const handleMouseDown = (
    e: React.MouseEvent,
    id: string,
    edge: "start" | "end",
  ) => {
    setIsDragging(true);
    setDraggedEdge({ id, edge });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !draggedEdge || !timelineRef.current) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newTime = minTime + (x / rect.width) * timeRange;

    const updatedData = timelineData.map((item) => {
      if (item.id === draggedEdge.id) {
        if (draggedEdge.edge === "start") {
          return { ...item, start: Math.min(newTime, item.end) };
        } else {
          return { ...item, end: Math.max(newTime, item.start) };
        }
      }
      return item;
    });

    setTimelineData(updatedData);

    // Update the original schedule
    const updatedSchedule = findAndUpdateSchedule(
      schedules,
      draggedEdge.id,
      updatedData.find((d) => d.id === draggedEdge.id)!,
    );
    if (updatedSchedule) {
      onUpdateSchedule(updatedSchedule);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedEdge(null);
  };

  const findAndUpdateSchedule = (
    schedules: Schedule[],
    id: string,
    updatedData: { start: number; end: number },
  ): Schedule | null => {
    for (const schedule of schedules) {
      if (schedule.id === id) {
        if (schedule.type === "calendar") {
          return {
            ...schedule,
            startTime: new Date(updatedData.start).toISOString(),
            endTime: new Date(updatedData.end).toISOString(),
          };
        } else if (schedule.type === "vector") {
          const parentStart = findParentStart(schedules, id);
          return {
            ...schedule,
            offset: Math.round((updatedData.start - parentStart) / 60000),
            duration: Math.round((updatedData.end - updatedData.start) / 60000),
          };
        }
      }
      if (schedule.children.length > 0) {
        const updatedChild = findAndUpdateSchedule(
          schedule.children,
          id,
          updatedData,
        );
        if (updatedChild) {
          return {
            ...schedule,
            children: schedule.children.map((child) =>
              child.id === updatedChild.id ? updatedChild : child,
            ),
          };
        }
      }
    }
    return null;
  };

  const findParentStart = (schedules: Schedule[], id: string): number => {
    for (const schedule of schedules) {
      if (schedule.children.some((child) => child.id === id)) {
        return schedule.type === "calendar"
          ? new Date(schedule.startTime).getTime()
          : findParentStart(schedules, schedule.id);
      }
      if (schedule.children.length > 0) {
        const parentStart = findParentStart(schedule.children, id);
        if (parentStart !== -1) return parentStart;
      }
    }
    return -1;
  };

  return (
    <div className="mt-4 rounded border p-4">
      <h3 className="mb-2 text-lg font-semibold">Timeline Visualization</h3>
      <div className="mb-2">
        <label className="mr-2">Time Unit:</label>
        <Select
          value={timeUnit}
          onValueChange={(e) => setTimeUnit(e as "minutes" | "hours" | "days")}
        >
          <option value="minutes">Minutes</option>
          <option value="hours">Hours</option>
          <option value="days">Days</option>
        </Select>
      </div>
      <div
        className="relative h-[200px] bg-gray-100"
        ref={timelineRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {timelineData.map((item, index) => (
          <div
            key={item.id}
            className="absolute flex h-8 cursor-move items-center justify-center overflow-hidden text-xs text-white"
            style={{
              left: `${((item.start - minTime) / timeRange) * 100}%`,
              width: `${((item.end - item.start) / timeRange) * 100}%`,
              top: `${index * 40}px`,
              backgroundColor: item.color,
            }}
          >
            <div
              className="absolute bottom-0 left-0 top-0 w-2 cursor-ew-resize bg-black bg-opacity-20"
              onMouseDown={(e) => handleMouseDown(e, item.id, "start")}
            />
            {item.name}
            <div
              className="absolute bottom-0 right-0 top-0 w-2 cursor-ew-resize bg-black bg-opacity-20"
              onMouseDown={(e) => handleMouseDown(e, item.id, "end")}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between">
        <span>{formatTime(minTime)}</span>
        <span>{formatTime(maxTime)}</span>
      </div>
      <div className="mt-4">
        <h4 className="mb-2 font-semibold">Legend</h4>
        <div className="flex flex-wrap">
          {colors.map((color, index) => (
            <div key={color} className="mb-2 mr-4 flex items-center">
              <div
                className="mr-2 h-4 w-4"
                style={{ backgroundColor: color }}
              ></div>
              <span>Level {index + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
