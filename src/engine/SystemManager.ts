import type { Body, BodyId, BodyType, StarSystem, StarType, SystemId } from "./gamedata/StarSystem.js";
import type { GameData } from "./GameData.js";
import { bodyId, systemId } from "./gamedata/StarSystem.js";
import { generateBodyResources } from "./generateBodyResources.js";
import { Store } from "./Store.js";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const BODY_TYPES: BodyType[] = ["rocky", "oceanic", "arid", "arctic", "gas_giant", "barren"];
const STAR_TYPES: StarType[] = ["yellow", "red_dwarf", "blue_giant", "white_dwarf", "neutron"];

const STAR_NAMES = [
  "Proxima", "Vega", "Sirius", "Tau Ceti", "Epsilon Eridani",
  "Barnard", "Rigel", "Deneb", "Arcturus", "Betelgeuse",
  "Aldebaran", "Fomalhaut", "Capella", "Pollux", "Castor",
];

const MIN_BODIES = 0;
const MAX_BODIES = 15;

interface BodySpec {
  bodyType: BodyType;
  homeworld?: boolean;
}

export interface GenerateSystemParams {
  connections?: SystemId[];
  minimumBodyCount?: number;
}

export class SystemManager {
  private systems = new Store<StarSystem>("System");
  private bodies = new Store<Body>("Body");
  private usedNames = new Set<string>();

  constructor(private data: GameData) {}

  get(id: SystemId): StarSystem {
    return this.systems.get(id);
  }

  all(): StarSystem[] {
    return this.systems.all();
  }

  getBody(id: BodyId): Body {
    return this.bodies.get(id);
  }

  getBodiesForSystem(systemId: SystemId): Body[] {
    return this.get(systemId).bodyIds.map((id) => this.getBody(id));
  }

  generate(params: GenerateSystemParams = {}): StarSystem {
    const { connections = [], minimumBodyCount = MIN_BODIES } = params;
    const name = this.pickName();
    const id = systemId(name.toLowerCase().replace(/ /g, "-"));
    const starType = STAR_TYPES[Math.floor(Math.random() * STAR_TYPES.length)];
    const count = minimumBodyCount + Math.floor(Math.random() * (MAX_BODIES - minimumBodyCount + 1));
    const specs: BodySpec[] = Array.from({ length: count }, () => ({
      bodyType: BODY_TYPES[Math.floor(Math.random() * BODY_TYPES.length)],
    }));
    return this.createSystem(id, name, starType, connections, specs);
  }

  generateSol(): StarSystem {
    return this.createSystem(
      systemId("sol"), "Sol", "yellow", [],
      [{ bodyType: "oceanic", homeworld: true }, { bodyType: "arid" }],
    );
  }

  private createSystem(
    id: SystemId,
    name: string,
    starType: StarType,
    connections: SystemId[],
    specs: BodySpec[],
  ): StarSystem {
    const bodyIds = this.createBodies(id, name, specs).map((body) => {
      this.bodies.add(body);
      return body.id;
    });
    const system: StarSystem = { id, name, starType, bodyIds, connections };
    this.systems.add(system);
    return system;
  }

  private createBodies(sysId: SystemId, sysName: string, specs: BodySpec[]): Body[] {
    return specs.map((spec, i) => {
      const letter = LETTERS[i + 1];
      return {
        type: "planet" as const,
        id: bodyId(`${sysId}-${letter.toLowerCase()}`),
        name: `${sysName} ${letter}`,
        bodyType: spec.bodyType,
        resources: generateBodyResources(this.data.resources.mineable(), spec.homeworld ?? false),
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
