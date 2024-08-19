import type { Meta, StoryObj } from "@storybook/react";
import { TreeView } from "@acausal/ui-core/tree-view";

const meta = {
  title: "Atelier/Hierarchy/Tree View",
  component: TreeView,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof TreeView>;

export default meta;
type Story = StoryObj<typeof meta>;

const treeViewElements = [
  {
    id: "1",
    name: "Root",
    children: [
      // ... existing tree structure ...
    ],
  },
];

export const Default: Story = {
  args: {
    elements: treeViewElements,
    initialSelectedId: "1",
    expandAll: true,
  },
};
