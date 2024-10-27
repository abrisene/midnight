import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Marquee } from "@acausal/ui-core/marquee";

const meta = {
  title: "Atelier/Presentation/Marquee",
  component: Marquee,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Marquee>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // speed: 100,
    // direction: "left",
    // pauseOnHover: true,
    children: (
      <div className="flex space-x-4">
        <span>Item 1</span>
        <span>Item 2</span>
        <span>Item 3</span>
        <span>Item 4</span>
        <span>Item 5</span>
      </div>
    ),
  },
  // render: () => (
  //   <Marquee>
  //     <div className="flex space-x-4">
  //       <span>Item 1</span>
  //       <span>Item 2</span>
  //       <span>Item 3</span>
  //       <span>Item 4</span>
  //       <span>Item 5</span>
  //     </div>
  //   </Marquee>
  // ),
};
