import type { Planet, PlanetId, PlanetType, StarSystem, StarType, SystemId } from "./gamedata/StarSystem.js";
import type { GameData } from "./GameData.js";
import { planetId, systemId } from "./gamedata/StarSystem.js";
import { generatePlanetResources } from "./generatePlanetResources.js";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const PLANET_TYPES: PlanetType[] = ["rocky", "oceanic", "arid", "arctic", "gas_giant", "barren"];
const STAR_TYPES: StarType[] = ["yellow", "red_dwarf", "blue_giant", "white_dwarf", "neutron"];

const STAR_NAMES = [
  "Proxima", "Vega", "Sirius", "Tau Ceti", "Epsilon Eridani",
  "Barnard", "Rigel", "Deneb", "Arcturus", "Betelgeuse",
  "Aldebaran", "Fomalhaut", "Capella", "Pollux", "Castor",
];

const MIN_PLANETS = 0;
const MAX_PLANETS = 15;

interface PlanetSpec {
  type: PlanetType;
  homeworld?: boolean;
}

export interface GenerateSystemParams {
  connections?: SystemId[];
  minimumPlanetCount?: number;
}

export class SystemManager {
  private systems = new Map<SystemId, StarSystem>();
  private usedNames = new Set<string>();

  constructor(private data: GameData) {}

  add(system: StarSystem): void {
    this.systems.set(system.id, system);
  }

  generate(params: GenerateSystemParams = {}): StarSystem {
    const { connections = [], minimumPlanetCount = MIN_PLANETS } = params;
    const name = this.pickName();
    const id = systemId(name.toLowerCase().replace(/ /g, "-"));
    const starType = STAR_TYPES[Math.floor(Math.random() * STAR_TYPES.length)];
    const count = minimumPlanetCount + Math.floor(Math.random() * (MAX_PLANETS - minimumPlanetCount + 1));
    const specs: PlanetSpec[] = Array.from({ length: count }, () => ({
      type: PLANET_TYPES[Math.floor(Math.random() * PLANET_TYPES.length)],
    }));
    return this.createSystem(id, name, starType, connections, specs);
  }

  generateSol(): StarSystem {
    return this.createSystem(
      systemId("sol"), "Sol", "yellow", [],
      [{ type: "oceanic", homeworld: true }, { type: "arid" }],
    );
  }

  get(id: SystemId): StarSystem | undefined {
    return this.systems.get(id);
  }

  all(): StarSystem[] {
    return Array.from(this.systems.values());
  }

  getPlanet(id: PlanetId): Planet | undefined {
    for (const system of this.systems.values()) {
      const planet = system.planets.find((p) => p.id === id);
      if (planet) return planet;
    }
    return undefined;
  }

  private createSystem(
    id: SystemId,
    name: string,
    starType: StarType,
    connections: SystemId[],
    specs: PlanetSpec[],
  ): StarSystem {
    const planets = this.createPlanets(id, name, specs);
    const system: StarSystem = { id, name, starType, planets, connections };
    this.systems.set(id, system);
    return system;
  }

  private createPlanets(sysId: SystemId, sysName: string, specs: PlanetSpec[]): Planet[] {
    return specs.map((spec, i) => {
      const letter = LETTERS[i + 1];
      return {
        id: planetId(`${sysId}-${letter.toLowerCase()}`),
        name: `${sysName} ${letter}`,
        type: spec.type,
        resources: generatePlanetResources(this.data.resources, spec.homeworld ?? false),
      };
    });
  }

  private pickName(): string {
    const available = STAR_NAMES.filter((n) => !this.usedNames.has(n));
    let name: string;
    if (available.length > 0) {
      name = available[Math.floor(Math.random() * available.length)];
    } else {
      const digits = Math.random() < 0.5 ? 3 : 4;
      const max = Math.pow(10, digits);
      const min = Math.pow(10, digits - 1);
      do {
        const base = STAR_NAMES[Math.floor(Math.random() * STAR_NAMES.length)];
        name = `${base} ${Math.floor(min + Math.random() * (max - min))}`;
      } while (this.usedNames.has(name));
    }
    this.usedNames.add(name);
    return name;
  }
}
