import React, { useMemo, useState } from "react";
import { Box, Text } from "ink";
import Screen from "src/ui/components/screen.js";
import Table, { type ColumnDef } from "src/ui/components/table.js";
import { useGameState } from "src/ui/components/game-state-context.js";
import { useProductionCycle } from "src/ui/hooks/use-production-cycle.js";
import { createSelectColonyCommand } from "../commands/select.js";
import SelectColonyDialog from "./select-colony-dialog.js";
import type { Colony } from "src/engine/gamedata/Colony.js";
import type { Body } from "src/engine/gamedata/StarSystem.js";
import type { GameData } from "src/engine/GameData.js";
import { predictYearlyMining } from "../../engine/production.js";

function fmt(n: number): string { return n.toLocaleString(); }

function fmtDelta(n: number): string {
  if (n === 0) return "—";
  return n > 0 ? `+${fmt(n)}` : fmt(n);
}

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

const resourceColumns: ColumnDef<ResourceRow>[] = [
  { title: "Resource", width: 14, render: (row) => row.name },
  { title: "Deposit", width: 12, align: "right", render: (row) => fmt(row.bodyAmount) },
  { title: "Access", width: 8, align: "right", render: (row) => row.accessibility.toFixed(2) },
  {
    title: "Mine/yr", width: 12, align: "right",
    render: (row) => <Text color={row.miningPerYear > 0 ? "green" : undefined}>{row.miningPerYear > 0 ? fmt(row.miningPerYear) : "—"}</Text>,
  },
  { title: "Stock", width: 12, align: "right", render: (row) => fmt(row.stockpile) },
  {
    title: "Δ/tick", width: 10, align: "right",
    render: (row) => <Text color={row.stockpileDelta > 0 ? "green" : row.stockpileDelta < 0 ? "red" : undefined}>{fmtDelta(row.stockpileDelta)}</Text>,
  },
];

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

const installationColumns: ColumnDef<InstallationRow>[] = [
  { title: "Installation", width: 20, render: (row) => row.name },
  { title: "#", width: 8, align: "right", render: (row) => String(row.count) },
  {
    title: "Per year", width: 14, align: "right",
    render: (row) => <Text color={row.miningPerInstallation > 0 ? "green" : undefined}>{row.miningPerInstallation > 0 ? fmt(row.miningPerInstallation) : "—"}</Text>,
  },
  {
    title: "Total/yr", width: 14, align: "right",
    render: (row) => <Text color={row.totalMining > 0 ? "green" : undefined}>{row.totalMining > 0 ? fmt(row.totalMining) : "—"}</Text>,
  },
];

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
          <Table columns={resourceColumns} data={rows} />
          <Box flexDirection="column" gap={1} marginTop={1}>
            <Text bold>Mining Capacity</Text>
            <Table columns={installationColumns} data={installationRows} emptyMessage="No mining installations" />
          </Box>
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
