import type { Meta, StoryObj } from "@storybook/react";
import { SkeletonBrowser } from "@acausal/ui-core/skeleton-browser";

const meta = {
  title: "Atelier/Mockups/Skeleton - Browser",
  component: SkeletonBrowser,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof SkeletonBrowser>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <div className="p-4">Content goes here</div>,
  },
};
