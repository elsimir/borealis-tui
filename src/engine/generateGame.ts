import { GameWorld } from "src/engine/GameWorld.js";
import { Empire, empireId } from "src/engine/gamedata/Empire.js";
import { colonyId } from "src/engine/gamedata/Colony.js";
import type { GameData } from "src/engine/GameData.js";

export function generateGame(data: GameData): GameWorld {
  const world = new GameWorld(data);
  const { resources } = data;

  const playerEmpire = new Empire(empireId("player"), "Player Empire", "#00AAFF");
  world.addPlayerEmpire(playerEmpire);
  const playerId = playerEmpire.id;

  const sol = world.systems.generateSol();

  world.revealSystem(playerId, sol.id, "surveyed", 0);

  world.colonies.add({
    id: colonyId("earth"),
    name: "Earth",
    empireId: playerId,
    systemId: sol.id,
    bodyId: sol.bodies[0].id,
    population: 8_000_000_000,
    foundedAt: 0,
    installations: { mine: 3 },
    stockpile: Object.fromEntries(resources.map((r) => [r.id, 1000])),
    stockpileDelta: {},
  });

  world.colonies.add({
    id: colonyId("mars"),
    name: "Mars",
    empireId: playerId,
    systemId: sol.id,
    bodyId: sol.bodies[1].id,
    population: 1_200_000,
    foundedAt: 0,
    installations: {},
    stockpile: {},
    stockpileDelta: {},
  });

  const nearby = world.systems.generate({ connections: [sol.id] });

  world.revealSystem(playerId, nearby.id, "surveyed", 0);

  world.colonies.add({
    id: colonyId("nearby-colony"),
    name: `${nearby.bodies[0].name} Colony`,
    empireId: playerId,
    systemId: nearby.id,
    bodyId: nearby.bodies[0].id,
    population: 2_400_000,
    foundedAt: 0,
    installations: {},
    stockpile: {},
    stockpileDelta: {},
  });

  return world;
}
