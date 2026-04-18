import { GameWorld } from "src/engine/GameWorld.js";
import { Empire, empireId } from "src/engine/gamedata/Empire.js";
import { colonyId } from "src/engine/gamedata/Colony.js";
import type { GameData } from "src/engine/GameData.js";

export const PLAYER_ID = empireId("player");

export function generateGame(data: GameData): GameWorld {
  const world = new GameWorld(data);
  const { resources } = data;

  world.empires.add(new Empire(PLAYER_ID, "Player Empire", true, "#00AAFF"));

  const sol = world.systems.generateSol();

  world.revealSystem(PLAYER_ID, sol.id, "surveyed", 0);

  world.colonies.add({
    id: colonyId("earth"),
    name: "Earth",
    empireId: PLAYER_ID,
    systemId: sol.id,
    planetId: sol.planets[0].id,
    population: 8_000_000_000,
    foundedAt: 0,
    installations: { mine: 3 },
    stockpile: Object.fromEntries(resources.map((r) => [r.id, 1000])),
    stockpileDelta: {},
  });

  world.colonies.add({
    id: colonyId("mars"),
    name: "Mars",
    empireId: PLAYER_ID,
    systemId: sol.id,
    planetId: sol.planets[1].id,
    population: 1_200_000,
    foundedAt: 0,
    installations: {},
    stockpile: {},
    stockpileDelta: {},
  });

  const nearby = world.systems.generate({ connections: [sol.id] });

  world.revealSystem(PLAYER_ID, nearby.id, "surveyed", 0);

  world.colonies.add({
    id: colonyId("nearby-colony"),
    name: `${nearby.planets[0].name} Colony`,
    empireId: PLAYER_ID,
    systemId: nearby.id,
    planetId: nearby.planets[0].id,
    population: 2_400_000,
    foundedAt: 0,
    installations: {},
    stockpile: {},
    stockpileDelta: {},
  });

  return world;
}
