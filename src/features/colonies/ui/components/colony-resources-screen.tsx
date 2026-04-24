import React, { useMemo, useState } from "react";
import { Box, Text } from "ink";
import Screen from "src/ui/components/screen.js";
import { useGameState } from "src/ui/components/game-state-context.js";
import { useProductionCycle } from "src/ui/hooks/use-production-cycle.js";
import { createSelectColonyCommand } from "../commands/select.js";
import SelectColonyDialog from "./select-colony-dialog.js";
import type { Colony } from "src/engine/gamedata/Colony.js";
import type { Body } from "src/engine/gamedata/StarSystem.js";
import type { GameData } from "src/engine/GameData.js";
import { predictYearlyMining } from "../../engine/production.js";

interface ResourceRow {
  name: string;
  bodyAmount: number;
  accessibility: number;
  miningPerYear: number;
  stockpile: number;
  stockpileDelta: number;
}

function buildRows(colony: Colony, body: Body, data: GameData): ResourceRow[] {
  const yearlyMining = predictYearlyMining(colony, body, data);
  return data.resources.mineable().map((resource) => {
    const deposit = body.resources[resource.id] ?? { amount: 0, accessibility: 0 };
    return {
      name: resource.name,
      bodyAmount: deposit.amount,
      accessibility: deposit.accessibility,
      miningPerYear: yearlyMining[resource.id] ?? 0,
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
        <Text bold>{padL("Deposit", colWidths.amount)}</Text>
        <Text bold>{padL("Access", colWidths.access)}</Text>
        <Text bold>{padL("Mine/yr", colWidths.mining)}</Text>
        <Text bold>{padL("Stock", colWidths.stockpile)}</Text>
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

interface InstallationRow {
  name: string;
  count: number;
  miningPerInstallation: number;
  totalMining: number;
}

function buildInstallationRows(colony: Colony, data: GameData): InstallationRow[] {
  return data.installations.miningInstallations()
    .filter((inst) => (colony.installations[inst.id] ?? 0) > 0)
    .map((inst) => {
      const count = colony.installations[inst.id];
      const miningPerInstallation = inst.output["mining_points"];
      return { name: inst.name, count, miningPerInstallation, totalMining: miningPerInstallation * count };
    });
}

function InstallationTable({ rows }: { rows: InstallationRow[] }) {
  const colWidths = { name: 20, count: 8, perInst: 14, total: 14 };

  function pad(s: string, w: number): string {
    return s.length >= w ? s.slice(0, w) : s + " ".repeat(w - s.length);
  }

  function padL(s: string, w: number): string {
    return s.length >= w ? s.slice(0, w) : " ".repeat(w - s.length) + s;
  }

  return (
    <Box flexDirection="column">
      <Box>
        <Text bold>{pad("Installation", colWidths.name)}</Text>
        <Text bold>{padL("#", colWidths.count)}</Text>
        <Text bold>{padL("Per year", colWidths.perInst)}</Text>
        <Text bold>{padL("Total/yr", colWidths.total)}</Text>
      </Box>
      <Text dimColor>{"─".repeat(colWidths.name + colWidths.count + colWidths.perInst + colWidths.total)}</Text>
      {rows.length === 0 ? (
        <Text dimColor>No mining installations</Text>
      ) : rows.map((row) => (
        <Box key={row.name}>
          <Text>{pad(row.name, colWidths.name)}</Text>
          <Text>{padL(String(row.count), colWidths.count)}</Text>
          <Text color={row.miningPerInstallation > 0 ? "green" : undefined}>
            {padL(row.miningPerInstallation > 0 ? fmt(row.miningPerInstallation) : "—", colWidths.perInst)}
          </Text>
          <Text color={row.totalMining > 0 ? "green" : undefined}>
            {padL(row.totalMining > 0 ? fmt(row.totalMining) : "—", colWidths.total)}
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
  const rows = buildRows(colony, body, data);
  const installationRows = buildInstallationRows(colony, data);

  const commands = useMemo(() => [
    createSelectColonyCommand(() => setSelectOpen(true)),
  ], []);

  return (
    <>
      <Screen commands={commands} context={["Colonies", colony.name, "Resources"]} onBack={onBack}>
        <Box flexDirection="column" gap={1}>
          <ResourceTable rows={rows} />
          <InstallationTable rows={installationRows} />
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
