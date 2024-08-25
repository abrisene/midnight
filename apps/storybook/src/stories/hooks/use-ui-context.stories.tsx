import type { Meta, StoryObj } from "@storybook/react";

import RPGCharacterGallery from "./use-llm-context-example";

const meta: Meta<typeof RPGCharacterGallery> = {
  title: "Atelier/Hooks/useUIContext",
  component: RPGCharacterGallery,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof RPGCharacterGallery>;

export const Default: Story = {};

export const WithOpenSidebar: Story = {
  parameters: {
    initialState: { isSidebarOpen: true },
  },
};

export const WithInteractions: Story = {
  parameters: {
    playInteractions: [
      { selector: 'div[data-name="Eldrin Shadowblade"]', action: "hover" },
      { selector: 'div[data-name="Lyra Stormweaver"]', action: "click" },
    ],
  },
};
