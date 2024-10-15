import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { BezierCurveEditor } from "@acausal/ui-viz/bezier-editor";
import { BezierCurvesManager } from "@acausal/ui-viz/bezier-manager";
import { BezierCurvesProvider } from "@acausal/ui-viz/use-bezier-editor";

const meta = {
  title: "Atelier/Bezier",
  component: BezierCurveEditor,
  decorators: [
    (Story) => (
      <BezierCurvesProvider>
        <Story />
      </BezierCurvesProvider>
    ),
  ],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof BezierCurveEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultBezierCurveEditor: Story = {
  args: {
    strokeColor: "stroke-blue-500",
    handleColor: "fill-red-500",
    lineWidth: 2,
    handleRadius: 8,
  },
  render: (args) => (
    <div style={{ width: "400px", height: "300px" }}>
      <BezierCurveEditor {...args} />
    </div>
  ),
};

export const CustomColorsBezierCurveEditor: Story = {
  args: {
    strokeColor: "stroke-green-500",
    handleColor: "fill-purple-500",
    lineWidth: 3,
    handleRadius: 10,
  },
  render: (args) => (
    <div style={{ width: "400px", height: "300px" }}>
      <BezierCurveEditor {...args} />
    </div>
  ),
};

export const BezierCurvesManagerStory: Story = {
  render: () => (
    <div style={{ width: "400px" }}>
      <BezierCurvesManager />
    </div>
  ),
};

export const CombinedBezierComponents: Story = {
  render: () => (
    <div className="flex flex-col gap-4" style={{ width: "600px" }}>
      <div style={{ height: "300px" }}>
        <BezierCurveEditor />
      </div>
      <BezierCurvesManager />
    </div>
  ),
};
