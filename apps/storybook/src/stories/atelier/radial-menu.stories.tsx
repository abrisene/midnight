import type { Meta, StoryObj } from "@storybook/react";
import RadialMenu from "@acausal/ui-core/radial-menu";

const meta = {
  title: "Atelier/Menus/Radial Menu",
  component: RadialMenu,
  decorators: [
    (Story) => (
      <div className="relative h-96 w-96">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    radius: { control: "number" },
    arcOffset: { control: "number" },
    arcStart: { control: "number" },
    arcEnd: { control: "number" },
    childOffset: { control: "number" },
  },
  parameters: {
    layout: "centered",
    fullscreen: true,
    padding: 15,
  },
} satisfies Meta<typeof RadialMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const DefaultChildren = () => (
  <>
    <div className="z-4 align-center flex size-10 cursor-pointer items-center rounded-full border-2 border-red-500 p-2 text-center transition-all hover:z-10 hover:scale-105 hover:saturate-200">
      1
    </div>
    <div className="z-3 align-center flex size-10 cursor-pointer items-center rounded-full border-2 border-blue-500 p-2 text-center transition-all hover:z-10 hover:scale-105 hover:saturate-200">
      2
    </div>
    <div className="z-2 align-center flex size-10 cursor-pointer items-center rounded-full border-2 border-green-500 p-2 text-center transition-all hover:z-10 hover:scale-105 hover:saturate-200">
      3
    </div>
    <div className="z-1 align-center flex size-10 cursor-pointer items-center rounded-full border-2 border-yellow-500 p-2 text-center transition-all hover:z-10 hover:scale-105 hover:saturate-200">
      4
    </div>
  </>
);

export const Default: Story = {
  args: {
    radius: 125,
    arcStart: 0,
    arcEnd: 180,
    arcOffset: 90,
    childOffset: -60,
    children: <DefaultChildren />,
  },
};

export const FullCircle: Story = {
  args: {
    ...Default.args,
    arcStart: 0,
    arcEnd: 360,
    arcOffset: 0,
  },
};

export const SmallRadius: Story = {
  args: {
    ...Default.args,
    radius: 75,
  },
};

export const LargeRadius: Story = {
  args: {
    ...Default.args,
    radius: 200,
  },
};

export const CustomArcRange: Story = {
  args: {
    ...Default.args,
    arcStart: 45,
    arcEnd: 315,
  },
};

export const MoreItems: Story = {
  args: {
    ...Default.args,
    children: (
      <>
        <DefaultChildren />
        <div className="z-1 align-center flex size-10 cursor-pointer items-center rounded-full border-2 border-purple-500 p-2 text-center transition-all hover:z-10 hover:scale-105 hover:saturate-200">
          5
        </div>
        <div className="z-1 align-center flex size-10 cursor-pointer items-center rounded-full border-2 border-pink-500 p-2 text-center transition-all hover:z-10 hover:scale-105 hover:saturate-200">
          6
        </div>
      </>
    ),
  },
};

export const CustomChildOffset: Story = {
  args: {
    ...Default.args,
    childOffset: -30,
  },
};
