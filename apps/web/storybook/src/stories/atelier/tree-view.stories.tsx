import type { Meta, StoryObj } from "@storybook/react";
import { TreeView } from "@acausal/ui-core/tree-view";

const meta = {
  title: "Atelier/Hierarchy/Tree View",
  component: TreeView,
  decorators: [
    (Story) => (
      <div className="relative h-96 w-96">
        <Story />
      </div>
    ),
  ],
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
      {
        id: "2",
        name: "Child 1",
        children: [
          {
            id: "4",
            name: "Grandchild 1",
            children: [],
          },
          {
            id: "5",
            name: "Grandchild 2",
            children: [],
          },
        ],
      },
      {
        id: "3",
        name: "Child 2",
        children: [
          {
            id: "6",
            name: "Grandchild 3",
            children: [],
          },
          {
            id: "7",
            name: "Grandchild 4",
            children: [],
          },
        ],
      },
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
