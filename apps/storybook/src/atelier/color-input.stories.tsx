import type { Meta, StoryObj } from "@storybook/react";
import { ColorInput } from "@acausal/ui-core/color-input";

// import "./globals.css";

const meta: Meta<typeof ColorInput> = {
  title: "Custom/Color Input",
  component: ColorInput,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ColorInput>;

export const Default: Story = {
  args: {
    value: "#ff0000",
  },
};

export const CustomSize: Story = {
  args: {
    value: "#00ff00",
    className: "h-12 w-12",
  },
};

export const Disabled: Story = {
  args: {
    value: "#0000ff",
    disabled: true,
  },
};

export const WithOnChange: Story = {
  args: {
    value: "#ff00ff",
    onChange: (e) => console.log("Color changed:", e.target.value),
  },
};

export const CustomStyle: Story = {
  args: {
    value: "#ffff00",
    style: { border: "2px solid black" },
  },
};
