import React, { useMemo, useState } from "react";
import { Box, Text } from "ink";
import Screen from "src/ui/components/screen.js";
import Table, { type ColumnDef } from "src/ui/components/table.js";
import { useGameState } from "src/ui/components/game-state-context.js";
import { useProductionCycle } from "src/ui/hooks/use-production-cycle.js";
import { createSelectColonyCommand } from "../commands/select.js";
import SelectColonyDialog from "./select-colony-dialog.js";
import BuildInstallationDialog from "./build-installation-dialog.js";
import type { Colony } from "src/engine/gamedata/Colony.js";
import { GameData } from "src/engine/GameData.js";

function fmt(n: number): string { return Math.round(n).toLocaleString(); }

interface QueueRow {
  position: number;
  name: string;
  count: number;
  percentComplete: number;
  costPerBuilding: number;
  totalCost: number;
}

function buildQueueRows(colony: Colony): QueueRow[] {
  return colony.constructionQueue.all().map((item, index) => {
    const installation = GameData.instance.installations.byId(item.installationId);
    const costPerBuilding = installation?.cost.build_points ?? item.remainingCost;
    return {
      position: index + 1,
      name: installation?.name ?? item.installationId,
      count: item.count,
      percentComplete: Math.floor((1 - item.remainingCost / costPerBuilding) * 100),
      costPerBuilding,
      totalCost: item.remainingCost + (item.count - 1) * costPerBuilding,
    };
  });
}

const queueColumns: ColumnDef<QueueRow>[] = [
  { title: "#", width: 4, render: (row) => String(row.position) },
  { title: "Installation", width: 20, render: (row) => row.name },
  { title: "Count", width: 8, align: "right", render: (row) => String(row.count) },
  { title: "% Complete", width: 12, align: "right", render: (row) => `${row.percentComplete}%` },
  { title: "Cost ea", width: 10, align: "right", render: (row, sel) => <Text dimColor={!sel}>{fmt(row.costPerBuilding)}</Text> },
  { title: "Total", width: 12, align: "right", render: (row, sel) => <Text dimColor={!sel}>{fmt(row.totalCost)}</Text> },
];

interface InstallationRow {
  name: string;
  count: number;
  buildPerInstallation: number;
  totalBuild: number;
}

function buildInstallationRows(colony: Colony): InstallationRow[] {
  return GameData.instance.installations.constructionInstallations()
    .filter((inst) => (colony.installations[inst.id] ?? 0) > 0)
    .map((inst) => {
      const count = colony.installations[inst.id];
      const buildPerInstallation = inst.output["build_points"];
      return { name: inst.name, count, buildPerInstallation, totalBuild: buildPerInstallation * count };
    });
}

const installationColumns: ColumnDef<InstallationRow>[] = [
  { title: "Installation", width: 20, render: (row) => row.name },
  { title: "#", width: 8, align: "right", render: (row) => String(row.count) },
  {
    title: "Per year", width: 14, align: "right",
    render: (row) => <Text color={row.buildPerInstallation > 0 ? "green" : undefined}>{row.buildPerInstallation > 0 ? fmt(row.buildPerInstallation) : "—"}</Text>,
  },
  {
    title: "Total/yr", width: 14, align: "right",
    render: (row) => <Text color={row.totalBuild > 0 ? "green" : undefined}>{row.totalBuild > 0 ? fmt(row.totalBuild) : "—"}</Text>,
  },
];

interface Props {
  colony: Colony;
  setColony: (colony: Colony) => void;
  onBack: () => void;
}

export default function ColonyConstructionScreen({ colony, setColony, onBack }: Props) {
  const [, forceUpdate] = useState(0);
  useProductionCycle();
  const { world } = useGameState();
  const [selectOpen, setSelectOpen] = useState(false);
  const [newOpen, setNewOpen] = useState(false);

  const colonies = world.colonies.forEmpire(world.getCurrentPlayerEmpire().id);
  const queueRows = buildQueueRows(colony);
  const installationRows = buildInstallationRows(colony);

  function handleBuildConfirmed(installation: { id: string; cost: { build_points: number } }, count: number) {
    colony.constructionQueue.add(installation.id, count, installation.cost.build_points);
    setNewOpen(false);
    forceUpdate((n) => n + 1);
  }

  const commands = useMemo(() => [
    {
      trigger: "n",
      name: "New",
      description: "Add installation to construction queue",
      onDispatch: () => setNewOpen(true),
    },
    createSelectColonyCommand(() => setSelectOpen(true)),
  ], []);

  return (
    <>
      <Screen commands={commands} context={["Colonies", colony.name, "Construction"]} onBack={onBack}>
        <Box flexDirection="column" gap={1}>
          <Table columns={queueColumns} data={queueRows} allowSelection emptyMessage="Queue is empty" />
          <Box flexDirection="column" gap={1} marginTop={1}>
            <Text bold>Build Capacity</Text>
            <Table columns={installationColumns} data={installationRows} emptyMessage="No construction installations" />
          </Box>
        </Box>
      </Screen>
      {newOpen && (
        <BuildInstallationDialog
          installations={GameData.instance.installations.all()}
          onDone={handleBuildConfirmed}
          onClose={() => setNewOpen(false)}
        />
      )}
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
