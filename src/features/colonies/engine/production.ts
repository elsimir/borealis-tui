import type { Colony } from "src/engine/gamedata/Colony.js";
import type { Body } from "src/engine/gamedata/StarSystem.js";
import type { GameData } from "src/engine/GameData.js";
import { isConstructionInstallation, isMiningInstallation } from "src/data/InstallationCollection.js";
import type { ConstructionStatus } from "src/engine/gamedata/ConstructionQueue.js";

export type { ConstructionStatus };

const SECONDS_PER_YEAR = 365 * 24 * 60 * 60;

export type MiningResult = Record<string, number>;

export function computeColonyMining(
  colony: Colony,
  body: Body,
  data: GameData,
): MiningResult {
  const stepFraction = data.settings.production_step / SECONDS_PER_YEAR;
  const result: MiningResult = {};

  for (const [instId, count] of Object.entries(colony.installations)) {
    const installation = data.installations.byId(instId);
    if (!installation) continue;

    if (isMiningInstallation(installation)) {
      const outputPerStep = installation.output["mining_points"] * stepFraction;
      for (const resource of data.resources.mineable()) {
        const deposit = body.resources[resource.id];
        if (!deposit || deposit.accessibility <= 0 || deposit.amount <= 0) continue;
        const mined = Math.min(outputPerStep * count * deposit.accessibility, deposit.amount);
        result[resource.id] = (result[resource.id] ?? 0) + mined;
      }
    } else {
      for (const [outputId, outputPerYear] of Object.entries(installation.output)) {
        result[outputId] = (result[outputId] ?? 0) + outputPerYear * stepFraction * count;
      }
    }
  }

  return result;
}

export function predictYearlyMining(colony: Colony, body: Body, data: GameData): Record<string, number> {
  const stepsPerYear = SECONDS_PER_YEAR / data.settings.production_step;
  const result = computeColonyMining(colony, body, data);
  return Object.fromEntries(
    Object.entries(result).map(([id, perStep]) => [id, Math.round(perStep * stepsPerYear)])
  );
}

export function runColonyMining(colony: Colony, body: Body, data: GameData): void {
  applyMiningResult(colony, body, computeColonyMining(colony, body, data));
}

export function applyMiningResult(colony: Colony, body: Body, result: MiningResult): void {
  colony.stockpileDelta = result;

  for (const [resourceId, amount] of Object.entries(result)) {
    colony.stockpile[resourceId] = (colony.stockpile[resourceId] ?? 0) + amount;
    const deposit = body.resources[resourceId];
    if (deposit) deposit.amount -= amount;
  }
}

export function computeColonyConstruction(colony: Colony, data: GameData): number {
  const stepFraction = data.settings.production_step / SECONDS_PER_YEAR;
  let buildPoints = 0;

  for (const [instId, count] of Object.entries(colony.installations)) {
    const installation = data.installations.byId(instId);
    if (!installation) continue;
    if (isConstructionInstallation(installation)) {
      buildPoints += installation.output["build_points"] * stepFraction * count;
    }
  }

  return buildPoints;
}

export function runColonyConstruction(colony: Colony, data: GameData): ConstructionStatus {
  const buildPoints = computeColonyConstruction(colony, data);

  if (buildPoints === 0) return { status: "Ok" };
  if (colony.constructionQueue.length === 0) return { status: "QueueEmpty" };

  return colony.constructionQueue.applyPoints(data, buildPoints);
}
