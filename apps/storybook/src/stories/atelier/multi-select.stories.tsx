import type { Meta, StoryObj } from "@storybook/react";
import { MultiSelect } from "@acausal/ui-core/multi-select";

const meta = {
  title: "Atelier/Inputs/Multi-Select",
  component: MultiSelect,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof MultiSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

const multiSelectOptions = [
  { value: "red", label: "Red", color: "#ff0000" },
  { value: "green", label: "Green", color: "#00ff00" },
  { value: "blue", label: "Blue", color: "#0000ff" },
];

export const Default: Story = {
  args: {
    options: multiSelectOptions,
    selectedValues: [],
    onChange: (selectedValues) => console.log(selectedValues),
  },
};
