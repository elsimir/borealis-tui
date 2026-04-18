import React, { useMemo, useState } from "react";
import { Box, Text } from "ink";
import Screen from "src/ui/components/screen.js";
import { useGameState } from "src/ui/components/game-state-context.js";
import { createSelectColonyCommand } from "../commands/select.js";
import ColonyResourcesScreen from "./colony-resources-screen.js";
import SelectColonyDialog from "./select-colony-dialog.js";
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

interface Props {
  colony: Colony;
  setColony: (colony: Colony) => void;
  onBack: () => void;
}

export default function ColonyDetailsScreen({ colony, setColony, onBack }: Props) {
  const gameState = useGameState();
  const [showResources, setShowResources] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);

  const { world } = gameState;
  const colonies = world.currentPlayerEmpireId ? world.colonies.forEmpire(world.currentPlayerEmpireId) : [];

  const commands = useMemo(() => [
    {
      trigger: "r",
      name: "Resources",
      description: "View planet resources and stockpile",
      onDispatch: () => setShowResources(true),
    },
    createSelectColonyCommand(() => setSelectOpen(true)),
  ], []);

  if (showResources) {
    return (
      <ColonyResourcesScreen
        colony={colony}
        setColony={setColony}
        onBack={() => setShowResources(false)}
      />
    );
  }

  return (
    <>
      <Screen commands={commands} context={["Colonies", colony.name]} onBack={onBack}>
        <Box gap={4}>
          <ColonyInfo colony={colony} />
          <InstallationList colony={colony} data={gameState.data} />
        </Box>
      </Screen>
      {selectOpen && (
        <SelectColonyDialog
          colonies={colonies}
          onDone={setColony}
          onClose={() => setSelectOpen(false)}
        />
      )}
    </>
  );
}
