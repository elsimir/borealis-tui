import type { Empire, EmpireId } from "./gamedata/Empire.js";

export class EmpireManager {
  private empires = new Map<EmpireId, Empire>();

  add(empire: Empire): void {
    this.empires.set(empire.id, empire);
  }

  get(id: EmpireId): Empire | undefined {
    return this.empires.get(id);
  }

  all(): Empire[] {
    return Array.from(this.empires.values());
  }

  player(): Empire | undefined {
    return this.all().find((e) => e.isPlayer);
  }
}
