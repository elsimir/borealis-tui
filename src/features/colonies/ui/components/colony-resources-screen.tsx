import React, { useMemo, useState } from "react";
import { Box, Text } from "ink";
import Screen from "src/ui/components/screen.js";
import { useGameState } from "src/ui/components/game-state-context.js";
import { useProductionCycle } from "src/ui/hooks/use-production-cycle.js";
import { createSelectColonyCommand } from "../commands/select.js";
import SelectColonyDialog from "./select-colony-dialog.js";
import type { Colony } from "src/engine/gamedata/Colony.js";
import type { BodyResources } from "src/engine/gamedata/StarSystem.js";
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
  bodyAmount: number;
  accessibility: number;
  miningPerYear: number;
  stockpile: number;
  stockpileDelta: number;
}

function buildRows(colony: Colony, bodyResources: BodyResources, data: GameData): ResourceRow[] {
  return data.resources.filter((r) => r.mineable).map((resource) => {
    const deposit = bodyResources[resource.id] ?? { amount: 0, accessibility: 0 };
    return {
      name: resource.name,
      bodyAmount: deposit.amount,
      accessibility: deposit.accessibility,
      miningPerYear: deposit.accessibility > 0
        ? calcMiningPerYear(colony.installations, data, deposit.accessibility)
        : 0,
      stockpile: colony.stockpile[resource.id] ?? 0,
      stockpileDelta: colony.stockpileDelta[resource.id] ?? 0,
    };
  });
}

function fmt(n: number): string { return n.toLocaleString(); }

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

  return (
    <Box flexDirection="column">
      <Box>
        <Text bold>{pad("Resource", colWidths.name)}</Text>
        <Text bold>{padL("Body Amt", colWidths.amount)}</Text>
        <Text bold>{padL("Access", colWidths.access)}</Text>
        <Text bold>{padL("Mining/yr", colWidths.mining)}</Text>
        <Text bold>{padL("Stockpile", colWidths.stockpile)}</Text>
        <Text bold>{padL("Δ/tick", colWidths.delta)}</Text>
      </Box>
      <Text dimColor>{"─".repeat(
        colWidths.name + colWidths.amount + colWidths.access +
        colWidths.mining + colWidths.stockpile + colWidths.delta
      )}</Text>
      {rows.map((row) => (
        <Box key={row.name}>
          <Text>{pad(row.name, colWidths.name)}</Text>
          <Text>{padL(fmt(row.bodyAmount), colWidths.amount)}</Text>
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

interface Props {
  colony: Colony;
  setColony: (colony: Colony) => void;
  onBack: () => void;
}

export default function ColonyResourcesScreen({ colony, setColony, onBack }: Props) {
  useProductionCycle();
  const { world, data } = useGameState();
  const [selectOpen, setSelectOpen] = useState(false);

  const colonies = world.colonies.forEmpire(world.getCurrentPlayerEmpire().id);
  const body = world.systems.getBody(colony.bodyId);
  const rows = buildRows(colony, body.resources, data);

  const commands = useMemo(() => [
    createSelectColonyCommand(() => setSelectOpen(true)),
  ], []);

  return (
    <>
      <Screen commands={commands} context={["Colonies", colony.name, "Resources"]} onBack={onBack}>
        <ResourceTable rows={rows} />
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
