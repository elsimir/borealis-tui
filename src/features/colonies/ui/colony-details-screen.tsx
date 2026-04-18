import React, { useMemo } from "react";
import { Box, Text } from "ink";
import Screen from "src/ui/screen.js";
import { useSetScreen } from "src/ui/screen-context.js";
import { useGameState } from "src/ui/game-state-context.js";
import { createSelectColonyCommand } from "../commands/select.js";
import { useSelectedColony } from "./selected-colony-context.js";
import ColonyResourcesScreen from "./colony-resources-screen.js";
import type { Colony } from "src/engine/gamedata/Colony.js";
import type { GameData } from "src/engine/GameData.js";

function ColonyInfo({ colony }: { colony: Colony }) {
  return (
    <Box flexDirection="column" gap={1}>
      <Text bold>{colony.name}</Text>
      <Box flexDirection="column">
        <Text>Population  <Text bold>{colony.population.toLocaleString()}</Text></Text>
        <Text>Founded     <Text bold>tick {colony.foundedAt}</Text></Text>
      </Box>
    </Box>
  );
}

function InstallationList({ colony, data }: { colony: Colony; data: GameData }) {
  const entries = Object.entries(colony.installations);
  if (entries.length === 0) return <Text dimColor>No installations.</Text>;

  return (
    <Box flexDirection="column" gap={1}>
      <Text bold>Installations</Text>
      <Box flexDirection="column">
        {entries.map(([id, count]) => {
          const inst = data.installations.find((i) => i.id === id);
          return (
            <Text key={id}>
              <Text bold>{count}x </Text>
              <Text>{inst?.name ?? id}</Text>
            </Text>
          );
        })}
      </Box>
    </Box>
  );
}

export default function ColonyDetailsScreen() {
  const { setScreen } = useSetScreen();
  const gameState = useGameState();
  const { colony, setColony } = useSelectedColony();

  const commands = useMemo(() => [
    {
      trigger: "r",
      name: "Resources",
      description: "View planet resources and stockpile",
      execute: () => ({ nextScreen: <ColonyResourcesScreen /> }),
    },
    createSelectColonyCommand(gameState, setColony),
  ], [setScreen, gameState, setColony]);

  if (!colony) return null;

  return (
    <Screen commands={commands} context={["Colonies", colony.name]}>
      <Box gap={4}>
        <ColonyInfo colony={colony} />
        <InstallationList colony={colony} data={gameState.data} />
      </Box>
    </Screen>
  );
}
