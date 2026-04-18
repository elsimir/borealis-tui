import type { Empire, EmpireId } from "src/engine/gamedata/Empire";
import type { SystemId } from "src/engine/gamedata/StarSystem";
import type { KnownSystem, SurveyLevel } from "src/engine/gamedata/KnownSystem";
import type { GameData } from "./GameData.js";
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
  currentPlayerEmpireId: EmpireId | null = null;
  private knownSystems = new Map<KnownSystemKey, KnownSystem>();

  constructor(data: GameData) {
    this.systems = new SystemManager(data);
  }

  addPlayerEmpire(empire: Empire): void {
    empire.isPlayer = true;
    this.empires.add(empire);
    this.playerEmpireIds.push(empire.id);
    if (this.currentPlayerEmpireId === null) this.currentPlayerEmpireId = empire.id;
  }

  getPlayerEmpire(): Empire | undefined {
    if (this.currentPlayerEmpireId === null) return undefined;
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
