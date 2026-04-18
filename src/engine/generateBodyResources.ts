import type { BodyResources } from "src/engine/gamedata/StarSystem.js";
import type { Resource, ResourceRarity } from "src/data/schemas/resource.js";

const ZERO_CHANCE = 0.5;
const MAX_AMOUNT = 10_000_000;
const ACCESS_MIN = 0.1;
const HOMEWORLD_AMOUNT_MIN = 200_000;
const HOMEWORLD_AMOUNT_MAX = 1_000_000;

const RARITY_POWER: Record<ResourceRarity, number> = {
  common:   0.7,
  uncommon: 2.0,
  rare:     4.0,
};

export function generateBodyResources(
  resources: readonly Resource[],
  homeworld: boolean,
): BodyResources {
  const result: BodyResources = {};

  for (const resource of resources) {
    if (!resource.mineable) continue;

    if (!homeworld && Math.random() < ZERO_CHANCE) {
      result[resource.id] = { amount: 0, accessibility: 0 };
      continue;
    }

    const power = RARITY_POWER[resource.rarity];
    const t = Math.pow(Math.random(), power);

    const amount = homeworld
      ? Math.round(HOMEWORLD_AMOUNT_MIN + t * (HOMEWORLD_AMOUNT_MAX - HOMEWORLD_AMOUNT_MIN))
      : Math.round(1 + t * (MAX_AMOUNT - 1));

    const accessibility = Math.round((ACCESS_MIN + t * (1 - ACCESS_MIN)) * 100) / 100;

    result[resource.id] = { amount, accessibility };
  }

  return result;
}
