import type { Empire, EmpireId } from "src/engine/gamedata/Empire";
import type { StarSystem, SystemId } from "src/engine/gamedata/StarSystem";
import type { Colony, ColonyId } from "src/engine/gamedata/Colony";
import type { KnownSystem, SurveyLevel } from "src/engine/gamedata/KnownSystem";

type KnownSystemKey = `${EmpireId}:${SystemId}`;

function knownSystemKey(empireId: EmpireId, systemId: SystemId): KnownSystemKey {
  return `${empireId}:${systemId}` as KnownSystemKey;
}

export class GameWorld {
  private empires = new Map<EmpireId, Empire>();
  private systems = new Map<SystemId, StarSystem>();
  private colonies = new Map<ColonyId, Colony>();
  private knownSystems = new Map<KnownSystemKey, KnownSystem>();

  addEmpire(empire: Empire): void {
    this.empires.set(empire.id, empire);
  }

  getEmpire(id: EmpireId): Empire | undefined {
    return this.empires.get(id);
  }

  getEmpires(): Empire[] {
    return Array.from(this.empires.values());
  }

  getPlayerEmpire(): Empire | undefined {
    return this.getEmpires().find((e) => e.isPlayer);
  }

  addSystem(system: StarSystem): void {
    this.systems.set(system.id, system);
  }

  getSystem(id: SystemId): StarSystem | undefined {
    return this.systems.get(id);
  }

  getSystems(): StarSystem[] {
    return Array.from(this.systems.values());
  }

  addColony(colony: Colony): void {
    this.colonies.set(colony.id, colony);
  }

  getColony(id: ColonyId): Colony | undefined {
    return this.colonies.get(id);
  }

  getColoniesForEmpire(empireId: EmpireId): Colony[] {
    return Array.from(this.colonies.values()).filter((c) => c.empireId === empireId);
  }

  revealSystem(
    empireId: EmpireId,
    systemId: SystemId,
    surveyLevel: SurveyLevel,
    atSeconds: number
  ): KnownSystem {
    const key = knownSystemKey(empireId, systemId);
    const existing = this.knownSystems.get(key);
    const entry: KnownSystem = {
      empireId,
      systemId,
      surveyLevel,
      firstContactAt: existing?.firstContactAt ?? atSeconds,
      lastUpdatedAt: atSeconds,
    };
    this.knownSystems.set(key, entry);
    return entry;
  }

  getKnownSystem(empireId: EmpireId, systemId: SystemId): KnownSystem | undefined {
    return this.knownSystems.get(knownSystemKey(empireId, systemId));
  }

  getKnownSystemsForEmpire(empireId: EmpireId): KnownSystem[] {
    return Array.from(this.knownSystems.values()).filter((ks) => ks.empireId === empireId);
  }
}
