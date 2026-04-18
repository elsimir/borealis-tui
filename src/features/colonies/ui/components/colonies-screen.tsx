import React, { useMemo, useState } from "react";
import { Box, Text } from "ink";
import Screen from "src/ui/components/screen.js";
import { useSetScreen } from "src/ui/components/screen-context.js";
import { useGameState } from "src/ui/components/game-state-context.js";
import type { Colony } from "src/engine/gamedata/Colony.js";
import type { GameWorld } from "src/engine/GameWorld.js";
import { createSelectColonyCommand } from "../../commands/select.js";
import { useSelectedColony } from "./selected-colony-context.js";
import ColonyDetailsScreen from "./colony-details-screen.js";
import SelectColonyDialog from "./select-colony-dialog.js";

function ColonyList({ world, colonies }: { world: GameWorld; colonies: Colony[] }) {
  if (colonies.length === 0) return <Text dimColor>No colonies.</Text>;

  const systemMap = new Map<string, Colony[]>();
  for (const colony of colonies) {
    const arr = systemMap.get(colony.systemId) ?? [];
    arr.push(colony);
    systemMap.set(colony.systemId, arr);
  }

  const groups = Array.from(systemMap.entries()).flatMap(([sId, cols]) => {
    const system = world.systems.get(sId as Parameters<typeof world.systems.get>[0]);
    return system ? [{ system, colonies: cols }] : [];
  });

  return (
    <Box flexDirection="column">
      {groups.map(({ system, colonies }, i) => (
        <Box key={system.id} flexDirection="column" marginTop={i > 0 ? 1 : 0}>
          <Text bold>{system.name}</Text>
          {colonies.map((colony, j) => (
            <Text key={colony.id}>
              <Text dimColor>{j < colonies.length - 1 ? "  ├ " : "  └ "}</Text>
              <Text>{colony.name}</Text>
              <Text dimColor>{`  pop: ${colony.population.toLocaleString()}`}</Text>
            </Text>
          ))}
        </Box>
      ))}
    </Box>
  );
}

export default function ColoniesScreen() {
  const gameState = useGameState();
  const { setScreen } = useSetScreen();
  const { setColony } = useSelectedColony();
  const [selectOpen, setSelectOpen] = useState(false);

  const commands = useMemo(() => [
    createSelectColonyCommand(() => setSelectOpen(true)),
  ], []);

  const { world } = gameState;
  const colonies = world.currentPlayerEmpireId ? world.colonies.forEmpire(world.currentPlayerEmpireId) : [];

  return (
    <>
      <Screen commands={commands} context={["Colonies"]}>
        <ColonyList world={world} colonies={colonies} />
      </Screen>
      {selectOpen && (
        <SelectColonyDialog
          colonies={colonies}
          onDone={(colony) => { setColony(colony); setScreen(<ColonyDetailsScreen />); }}
          onClose={() => setSelectOpen(false)}
        />
      )}
    </>
  );
}
