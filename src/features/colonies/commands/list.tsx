import React from "react";
import { Box, Text } from "ink";
import type { Command } from "src/commands/command.js";
import type { CommandContext } from "src/commands/context.js";
import type { GameWorld } from "src/engine/GameWorld.js";
import type { EmpireId } from "src/engine/gamedata/Empire.js";
import type { Colony } from "src/engine/gamedata/Colony.js";
import type { StarSystem } from "src/engine/gamedata/StarSystem.js";

function ColonyTree({ groups }: { groups: { system: StarSystem; colonies: Colony[] }[] }) {
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

function NoColonies() {
  return <Text dimColor>No colonies.</Text>;
}

export function createListColoniesCommand(world: GameWorld, playerId: EmpireId): Command {
  return {
    keywords: ["l"],
    name: "List",
    description: "List your colonies",
    help() {
      return "Usage: list  —  show all colonies";
    },
    validate() {
      return true;
    },
    execute(_input: string, ctx: CommandContext) {
      const colonies = world.getColoniesForEmpire(playerId);
      if (colonies.length === 0) {
        ctx.outputReact(<NoColonies />);
        return;
      }

      const systemMap = new Map<string, Colony[]>();
      for (const colony of colonies) {
        const existing = systemMap.get(colony.systemId);
        if (existing) existing.push(colony);
        else systemMap.set(colony.systemId, [colony]);
      }

      const groups = Array.from(systemMap.entries()).flatMap(([sId, cols]) => {
        const system = world.getSystem(sId as Parameters<typeof world.getSystem>[0]);
        return system ? [{ system, colonies: cols }] : [];
      });

      ctx.outputReact(<ColonyTree groups={groups} />);
    },
  };
}
