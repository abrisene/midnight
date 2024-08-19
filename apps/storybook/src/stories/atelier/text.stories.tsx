import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "@acausal/ui-core/text";

const meta = {
  title: "Atelier/Typography/Text",
  component: Text,
  argTypes: {
    variant: {
      control: "select",
      options: [
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "p",
        "lead",
        "large",
        "small",
        "muted",
        "pre",
        "blockquote",
        "aside",
      ],
    },
    font: {
      control: "select",
      options: ["sans", "serif", "mono"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    children: { control: "text" },
    className: { control: "text" },
  },
  parameters: {
    layout: "centered",
    fullscreen: true,
    padding: 15,
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const H1: Story = {
  args: {
    variant: "h1",
    children: "Heading 1",
  },
};

export const H2: Story = {
  args: {
    variant: "h2",
    children: "Heading 2",
  },
};

export const H3: Story = {
  args: {
    variant: "h3",
    children: "Heading 3",
  },
};

export const H4: Story = {
  args: {
    variant: "h4",
    children: "Heading 4",
  },
};

export const H5: Story = {
  args: {
    variant: "h5",
    children: "Heading 5",
  },
};

export const H6: Story = {
  args: {
    variant: "h6",
    children: "Heading 6",
  },
};

export const P: Story = {
  args: {
    variant: "p",
    children:
      "This is a paragraph of text. It demonstrates the default paragraph styling.",
  },
};

export const Lead: Story = {
  args: {
    variant: "lead",
    children: "This is a lead paragraph, used for introductory text.",
  },
};

export const Large: Story = {
  args: {
    variant: "large",
    children: "This is large text.",
  },
};

export const Small: Story = {
  args: {
    variant: "small",
    children: "This is small text.",
  },
};

export const Muted: Story = {
  args: {
    variant: "muted",
    children: "This is muted text.",
  },
};

export const CustomClassName: Story = {
  args: {
    variant: "p",
    children: "This text has a custom class applied.",
    className: "text-blue-500 font-bold",
  },
};

export const AsChild: Story = {
  args: {
    asChild: true,
    children: <a href="#">This is a link styled as text</a>,
  },
};

export const Pre: Story = {
  args: {
    variant: "pre",
    children: "This is preformatted text.",
    font: "mono",
  },
};

export const Blockquote: Story = {
  args: {
    variant: "blockquote",
    children: "This is a blockquote.",
  },
};

export const Aside: Story = {
  args: {
    variant: "aside",
    children: "This is an aside text.",
  },
};

export const FontSerif: Story = {
  args: {
    variant: "p",
    font: "serif",
    children: "This text uses a serif font.",
  },
};

export const FontMono: Story = {
  args: {
    variant: "p",
    font: "mono",
    children: "This text uses a monospace font.",
  },
};

export const SizeXL: Story = {
  args: {
    variant: "p",
    size: "xl",
    children: "This is extra large text.",
  },
};

export const SizeXS: Story = {
  args: {
    variant: "p",
    size: "xs",
    children: "This is extra small text.",
  },
};
