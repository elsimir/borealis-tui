import type { Empire, EmpireId } from "src/engine/gamedata/Empire";
import type { SystemId } from "src/engine/gamedata/StarSystem";
import type { KnownSystem, SurveyLevel } from "src/engine/gamedata/KnownSystem";
import { ColonyManager } from "./ColonyManager.js";
import { EmpireManager } from "./EmpireManager.js";
import { SystemManager } from "./SystemManager.js";

type KnownSystemKey = `${EmpireId}:${SystemId}`;

function knownSystemKey(empireId: EmpireId, systemId: SystemId): KnownSystemKey {
  return `${empireId}:${systemId}` as KnownSystemKey;
}

export class GameWorld {
  readonly empires = new EmpireManager();
  readonly systems: SystemManager;
  readonly colonies = new ColonyManager();
  readonly playerEmpireIds: EmpireId[] = [];
  private currentPlayerEmpireId: EmpireId | null = null;
  private knownSystems = new Map<KnownSystemKey, KnownSystem>();

  constructor() {
    this.systems = new SystemManager();
  }

  addPlayerEmpire(empire: Empire): void {
    empire.isPlayer = true;
    this.empires.add(empire);
    this.playerEmpireIds.push(empire.id);
    if (this.currentPlayerEmpireId === null) this.currentPlayerEmpireId = empire.id;
  }

  getCurrentPlayerEmpire(): Empire {
    if (this.currentPlayerEmpireId === null) throw new Error("No player empire set");
    return this.empires.get(this.currentPlayerEmpireId);
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
