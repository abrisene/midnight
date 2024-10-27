import type { Meta, StoryObj } from "@storybook/react";

import type { Schedule } from "../schedule/types";

import { ScheduleManager } from "../schedule";

const meta: Meta<typeof ScheduleManager> = {
  title: "Atelier/ScheduleManager",
  component: ScheduleManager,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof ScheduleManager>;

const initialSchedules: Schedule[] = [
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

export const Default: Story = {
  args: {
    initialSchedules,
    onSchedulesChange: (schedules) =>
      console.log("Schedules changed:", schedules),
  },
};
