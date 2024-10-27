import type { Meta, StoryObj } from "@storybook/react";
import { AnimatedCursor, Cursor, Pointer } from "@acausal/ui-core/cursor";

const meta = {
  title: "Atelier/Cursor/Cursor",
  parameters: {
    layout: "centered",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="space-y-4">
      <Cursor />
      <AnimatedCursor text="Hover me!" />
      <Pointer name="User">
        <div className="h-40 w-80 bg-gray-200 p-4">
          Move your cursor over this area
        </div>
      </Pointer>
    </div>
  ),
};
