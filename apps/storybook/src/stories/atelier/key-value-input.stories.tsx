import type { Meta, StoryObj } from "@storybook/react";
import { KeyValueEditor } from "@acausal/ui-core/key-value-input";

const meta: Meta<typeof KeyValueEditor> = {
  title: "Atelier/Inputs/KeyValueEditor",
  component: KeyValueEditor,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof KeyValueEditor>;

export const Default: Story = {
  args: {
    label: "Default Key-Value Editor",
  },
};

export const WithDefaultValues: Story = {
  args: {
    label: "Editor with Default Values",
    defaultValues: { key: "defaultKey", value: "defaultValue", weight: 10 },
  },
};

export const WithCustomClasses: Story = {
  args: {
    label: "Editor with Custom Classes",
    inputClassName: "custom-input",
    keyInputClassName: "custom-key-input",
    valueInputClassName: "custom-value-input",
    weightInputClassName: "custom-weight-input",
  },
};

export const WithCallbacks: Story = {
  args: {
    label: "Editor with Callbacks",
    onKeyChanged: (key) => console.log("Key changed:", key),
    onValueChanged: (value) => console.log("Value changed:", value),
    onWeightChanged: (weight) => console.log("Weight changed:", weight),
  },
};

export const WithBooleanType: Story = {
  args: {
    label: "Editor with Boolean Type",
    type: "boolean",
  },
};
