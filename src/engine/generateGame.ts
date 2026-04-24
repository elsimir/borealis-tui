import { GameWorld } from "src/engine/GameWorld.js";
import { Empire, empireId } from "src/engine/gamedata/Empire.js";
import { colonyId } from "src/engine/gamedata/Colony.js";
import { GameData } from "src/engine/GameData.js";

export function generateGame(): GameWorld {
  const world = new GameWorld();
  const { resources, settings } = GameData.instance;

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
    bodyId: sol.bodyIds[0],
    population: 8_000_000_000,
    foundedAt: 0,
    installations: settings.game_setup.profiles["default"].installations,
    stockpile: Object.fromEntries(resources.all().map((r) => [r.id, 1000])),
  });

  world.colonies.add({
    id: colonyId("mars"),
    name: "Mars",
    empireId: playerId,
    systemId: sol.id,
    bodyId: sol.bodyIds[1],
    population: 1_200_000,
    foundedAt: 0,
    installations: {},
    stockpile: {},
  });

  const nearby = world.systems.generate({ connections: [sol.id] });

  world.revealSystem(playerId, nearby.id, "surveyed", 0);

  world.colonies.add({
    id: colonyId("nearby-colony"),
    name: `${world.systems.getBody(nearby.bodyIds[0]).name} Colony`,
    empireId: playerId,
    systemId: nearby.id,
    bodyId: nearby.bodyIds[0],
    population: 2_400_000,
    foundedAt: 0,
    installations: {},
    stockpile: {},
  });

  return world;
}
