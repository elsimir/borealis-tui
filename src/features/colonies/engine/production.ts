import type { Colony } from "src/engine/gamedata/Colony.js";
import type { Body } from "src/engine/gamedata/StarSystem.js";
import type { GameData } from "src/engine/GameData.js";
import { PRODUCTION_STEP_SECONDS } from "src/engine/GameClock.js";

const SECONDS_PER_YEAR = 365 * 24 * 60 * 60;
const STEP_FRACTION = PRODUCTION_STEP_SECONDS / SECONDS_PER_YEAR; // 5/365

export interface ProductionResult {
  stockpileDelta: Record<string, number>;
}

export function runColonyProduction(
  colony: Colony,
  body: Body,
  data: GameData,
  elapsedSeconds: number,
): ProductionResult {
  const delta: Record<string, number> = {};

  for (const [instId, count] of Object.entries(colony.installations)) {
    const installation = data.installations.byId(instId);
    if (!installation) continue;

    for (const [outputId, outputPerYear] of Object.entries(installation.output)) {
      const outputPerStep = outputPerYear * STEP_FRACTION;
      if (outputId === "mining_points") {
        // mining_points drives mineral extraction per resource, not a direct stockpile output
        for (const resource of data.resources.mineable()) {
          const deposit = body.resources[resource.id];
          if (!deposit || deposit.accessibility <= 0) continue;
          delta[resource.id] = (delta[resource.id] ?? 0) + outputPerStep * count * deposit.accessibility;
        }
      } else {
        delta[outputId] = (delta[outputId] ?? 0) + outputPerStep * count;
      }
    }
  }

  return { stockpileDelta: delta };
}

export function applyProductionResult(colony: Colony, result: ProductionResult): void {
  colony.stockpileDelta = result.stockpileDelta;

  for (const [resourceId, amount] of Object.entries(result.stockpileDelta)) {
    colony.stockpile[resourceId] = (colony.stockpile[resourceId] ?? 0) + amount;
  }
}
