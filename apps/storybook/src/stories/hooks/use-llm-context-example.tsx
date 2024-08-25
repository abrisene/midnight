import React, { useState } from "react";
import { Button } from "@acausal/ui-core/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@acausal/ui-core/card";
import { useContextualData } from "@acausal/ui-llm";
import { Sidebar } from "lucide-react";

type Character = {
  name: string;
  portrait: string;
  description: string;
  stats: Record<string, number>;
};

export const RPGCharacterGallery = () => {
  const {
    currentData,
    history,
    handleHover,
    handleMouseLeave,
    handleInteraction,
  } = useContextualData({ type: "initial", data: null });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const characters = [
    {
      name: "Eldrin Shadowblade",
      portrait: "/api/placeholder/200/200",
      description: "A cunning rogue with a heart of gold",
      stats: { Agility: 18, Vigor: 12, Intelligence: 14, Charisma: 16 },
    },
    {
      name: "Lyra Stormweaver",
      portrait: "/api/placeholder/200/200",
      description: "A powerful mage specializing in elemental magic",
      stats: { Agility: 10, Vigor: 8, Intelligence: 20, Wisdom: 18 },
    },
    {
      name: "Thorgar Ironheart",
      portrait: "/api/placeholder/200/200",
      description: "A stalwart dwarf warrior and master blacksmith",
      stats: {
        Strength: 18,
        Constitution: 16,
        Craftsmanship: 20,
        Willpower: 14,
      },
    },
  ];

  const CharacterCard = ({ character }: { character: Character }) => (
    <Card
      className="m-4 w-64"
      onMouseEnter={(e) => handleHover(e.currentTarget)}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => handleInteraction(e.currentTarget, "click")}
      data-name={character.name}
      data-description={character.description}
    >
      <CardHeader>
        <img
          src={character.portrait}
          alt={character.name}
          className="h-48 w-full object-cover"
        />
        <CardTitle>{character.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-gray-600">{character.description}</p>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(character.stats).map(([stat, value]) => (
            <div key={stat} className="text-sm">
              <span className="font-bold">{stat}:</span> {value}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex">
      <div className="flex flex-wrap justify-center p-4">
        {characters.map((character, index) => (
          <CharacterCard key={index} character={character} />
        ))}
      </div>
      <Button
        className="fixed right-4 top-4 rounded-full bg-gray-200 p-2"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Sidebar size={24} />
      </Button>
      {isSidebarOpen && (
        <div className="fixed right-0 top-0 h-full w-64 overflow-y-auto p-4 shadow-lg">
          <h2 className="mb-4 text-xl font-bold">Contextual Data</h2>
          <pre className="mb-4 whitespace-pre-wrap text-sm">
            {JSON.stringify(currentData, null, 2)}
          </pre>
          <h3 className="mb-2 text-lg font-bold">History</h3>
          <ul className="text-sm">
            {history.map((item, index) => (
              <li key={index} className="mb-2">
                <span className="font-bold">
                  {new Date(item.timestamp).toLocaleTimeString()}:
                </span>
                <br />
                {item.interactionType}: {item.data.type} - {item.data.data.name}
                <pre className="mt-1 whitespace-pre-wrap text-xs">
                  {JSON.stringify(item.data, null, 2)}
                </pre>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RPGCharacterGallery;
