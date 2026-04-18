import React, { useMemo } from "react";
import { Box, Text } from "ink";
import Screen from "src/ui/screen.js";
import { useGameState } from "src/ui/game-state-context.js";
import { useProductionCycle } from "src/ui/use-production-cycle.js";
import { createSelectColonyCommand } from "../commands/select.js";
import { useSelectedColony } from "./selected-colony-context.js";
import type { Colony } from "src/engine/gamedata/Colony.js";
import type { PlanetResources } from "src/engine/gamedata/StarSystem.js";
import type { GameData } from "src/engine/GameData.js";
function calcMiningPerYear(
  installations: Record<string, number>,
  data: GameData,
  accessibility: number,
): number {
  let miningPointsPerYear = 0;
  for (const [instId, count] of Object.entries(installations)) {
    const inst = data.installations.find((i) => i.id === instId);
    if (!inst) continue;
    miningPointsPerYear += (inst.output["mining_points"] ?? 0) * count;
  }
  return Math.round(miningPointsPerYear * accessibility);
}

interface ResourceRow {
  name: string;
  planetAmount: number;
  accessibility: number;
  miningPerYear: number;
  stockpile: number;
  stockpileDelta: number;
}

function buildRows(
  colony: Colony,
  planetResources: PlanetResources,
  data: GameData,
): ResourceRow[] {
  return data.resources.filter((r) => r.mineable).map((resource) => {
    const planet = planetResources[resource.id] ?? { amount: 0, accessibility: 0 };
    return {
      name: resource.name,
      planetAmount: planet.amount,
      accessibility: planet.accessibility,
      miningPerYear: planet.accessibility > 0
        ? calcMiningPerYear(colony.installations, data, planet.accessibility)
        : 0,
      stockpile: colony.stockpile[resource.id] ?? 0,
      stockpileDelta: colony.stockpileDelta[resource.id] ?? 0,
    };
  });
}

function fmt(n: number): string {
  return n.toLocaleString();
}

function fmtDelta(n: number): string {
  if (n === 0) return "—";
  return n > 0 ? `+${fmt(n)}` : fmt(n);
}

function ResourceTable({ rows }: { rows: ResourceRow[] }) {
  const colWidths = { name: 14, amount: 12, access: 8, mining: 12, stockpile: 12, delta: 10 };

  function pad(s: string, w: number): string {
    return s.length >= w ? s.slice(0, w) : s + " ".repeat(w - s.length);
  }

  function padL(s: string, w: number): string {
    return s.length >= w ? s.slice(0, w) : " ".repeat(w - s.length) + s;
  }

  const header = (
    <Box>
      <Text bold>{pad("Resource", colWidths.name)}</Text>
      <Text bold>{padL("Planet Amt", colWidths.amount)}</Text>
      <Text bold>{padL("Access", colWidths.access)}</Text>
      <Text bold>{padL("Mining/yr", colWidths.mining)}</Text>
      <Text bold>{padL("Stockpile", colWidths.stockpile)}</Text>
      <Text bold>{padL("Δ/tick", colWidths.delta)}</Text>
    </Box>
  );

  const divider = (
    <Text dimColor>{"─".repeat(
      colWidths.name + colWidths.amount + colWidths.access +
      colWidths.mining + colWidths.stockpile + colWidths.delta
    )}</Text>
  );

  return (
    <Box flexDirection="column">
      {header}
      {divider}
      {rows.map((row) => (
        <Box key={row.name}>
          <Text>{pad(row.name, colWidths.name)}</Text>
          <Text>{padL(fmt(row.planetAmount), colWidths.amount)}</Text>
          <Text>{padL(row.accessibility.toFixed(2), colWidths.access)}</Text>
          <Text color={row.miningPerYear > 0 ? "green" : undefined}>
            {padL(row.miningPerYear > 0 ? fmt(row.miningPerYear) : "—", colWidths.mining)}
          </Text>
          <Text>{padL(fmt(row.stockpile), colWidths.stockpile)}</Text>
          <Text color={row.stockpileDelta > 0 ? "green" : row.stockpileDelta < 0 ? "red" : undefined}>
            {padL(fmtDelta(row.stockpileDelta), colWidths.delta)}
          </Text>
        </Box>
      ))}
    </Box>
  );
}

export default function ColonyResourcesScreen() {
  useProductionCycle();
  const gameState = useGameState();
  const { world, data } = gameState;
  const { colony, setColony } = useSelectedColony();
  const planet = colony ? world.systems.getPlanet(colony.planetId) : undefined;
  const rows = colony ? buildRows(colony, planet?.resources ?? {}, data) : [];

  const commands = useMemo(() => [
    createSelectColonyCommand(gameState, setColony),
  ], [gameState, setColony]);

  if (!colony) return null;

  return (
    <Screen commands={commands} context={["Colonies", colony.name, "Resources"]}>
      <ResourceTable rows={rows} />
    </Screen>
  );
}
