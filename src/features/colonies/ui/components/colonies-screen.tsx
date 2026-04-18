import React, { useMemo, useState } from "react";
import { Box, Text } from "ink";
import Screen from "src/ui/components/screen.js";
import { useGameState } from "src/ui/components/game-state-context.js";
import type { Colony } from "src/engine/gamedata/Colony.js";
import type { GameWorld } from "src/engine/GameWorld.js";
import { createSelectColonyCommand } from "../commands/select.js";
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

  const groups = Array.from(systemMap.entries()).map(([sId, cols]) => ({
    system: world.systems.get(sId as Parameters<typeof world.systems.get>[0]),
    colonies: cols,
  }));

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

export default function ColoniesScreen({ onBack }: { onBack: () => void }) {
  const { world } = useGameState();
  const [selectedColony, setSelectedColony] = useState<Colony | null>(null);
  const [selectOpen, setSelectOpen] = useState(false);

  const colonies = world.colonies.forEmpire(world.getCurrentPlayerEmpire().id);

  const commands = useMemo(() => [
    createSelectColonyCommand(() => setSelectOpen(true)),
  ], []);

  if (selectedColony) {
    return (
      <ColonyDetailsScreen
        colony={selectedColony}
        setColony={setSelectedColony}
        onBack={() => setSelectedColony(null)}
      />
    );
  }

  return (
    <>
      <Screen commands={commands} context={["Colonies"]} onBack={onBack}>
        <ColonyList world={world} colonies={colonies} />
      </Screen>
      {selectOpen && (
        <SelectColonyDialog
          colonies={colonies}
          onDone={(colony) => { setSelectedColony(colony); }}
          onClose={() => setSelectOpen(false)}
        />
      )}
    </>
  );
}
