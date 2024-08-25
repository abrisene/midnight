import type { Meta, StoryObj } from "@storybook/react";
import { Schedule, ScheduleItem } from "@acausal/ui-admin/schedule";

const meta: Meta<typeof ScheduleItem> = {
  title: "Atelier/Schedule/Schedule Item",
  component: ScheduleItem,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof ScheduleItem>;

const schedule: Schedule = {
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
};

export const Default: Story = {
  args: {
    schedule,
    depth: 0,
    onUpdate: (updatedSchedule) =>
      console.log("Schedule updated:", updatedSchedule),
    onDelete: () => console.log("Schedule deleted"),
    onAddChild: () => console.log("Child schedule added"),
  },
};
