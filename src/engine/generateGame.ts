import { GameWorld } from "src/engine/GameWorld.js";
import { empireId } from "src/engine/gamedata/Empire.js";
import { systemId, planetId } from "src/engine/gamedata/StarSystem.js";
import { colonyId } from "src/engine/gamedata/Colony.js";

export const PLAYER_ID = empireId("player");

export function generateGame(): GameWorld {
  const world = new GameWorld();

  world.addEmpire({
    id: PLAYER_ID,
    name: "Player Empire",
    isPlayer: true,
    color: "#00AAFF",
  });

  const earth = { id: planetId("earth"), name: "Earth", type: "oceanic" as const };
  const mars = { id: planetId("mars"), name: "Mars", type: "arid" as const };

  world.addSystem({
    id: systemId("sol"),
    name: "Sol",
    x: 0,
    y: 0,
    starType: "yellow",
    planets: [earth, mars],
    connections: [],
  });

  world.revealSystem(PLAYER_ID, systemId("sol"), "surveyed", 0);

  world.addColony({
    id: colonyId("earth"),
    name: "Earth",
    empireId: PLAYER_ID,
    systemId: systemId("sol"),
    planetId: earth.id,
    population: 8_000_000_000,
    foundedAt: 0,
  });

  world.addColony({
    id: colonyId("mars"),
    name: "Mars",
    empireId: PLAYER_ID,
    systemId: systemId("sol"),
    planetId: mars.id,
    population: 1_200_000,
    foundedAt: 0,
  });

  const proximaB = { id: planetId("proxima-b"), name: "Proxima b", type: "arid" as const };

  world.addSystem({
    id: systemId("alpha-centauri"),
    name: "Alpha Centauri",
    x: 4,
    y: 2,
    starType: "yellow",
    planets: [proximaB],
    connections: [systemId("sol")],
  });

  world.revealSystem(PLAYER_ID, systemId("alpha-centauri"), "surveyed", 0);

  world.addColony({
    id: colonyId("proxima-b"),
    name: "Proxima b",
    empireId: PLAYER_ID,
    systemId: systemId("alpha-centauri"),
    planetId: proximaB.id,
    population: 2_400_000,
    foundedAt: 0,
  });

  return world;
}
