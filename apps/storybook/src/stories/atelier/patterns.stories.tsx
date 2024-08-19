import type { Meta, StoryObj } from "@storybook/react";
import {
  DiagonalStripesPattern,
  DotGridPattern,
  GridPattern,
  HexagonPattern,
} from "@acausal/ui-core/patterns";

const meta = {
  title: "Atelier/Backgrounds/Patterns",
  parameters: {
    layout: "centered",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const DotGrid: Story = {
  render: () => (
    <DotGridPattern
      width={200}
      height={200}
      // fill="#000"
      radius={2}
      gap={20}
      patternWidth={200}
      patternHeight={200}
    />
  ),
};

export const Grid: Story = {
  render: () => (
    <GridPattern
      width={200}
      height={200}
      // stroke="#000"
      strokeWidth={1}
      gap={20}
    />
  ),
};

export const Hexagon: Story = {
  render: () => (
    <HexagonPattern
      width={200}
      height={200}
      // fill="#f0f0f0"
      // stroke="#000"
      strokeWidth={1}
      sideLength={20}
    />
  ),
};

export const DiagonalStripes: Story = {
  render: () => (
    <DiagonalStripesPattern
      width={200}
      height={200}
      // stroke="#000"
      strokeWidth={2}
      gap={20}
    />
  ),
};
