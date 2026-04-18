import type { Empire, EmpireId } from "./gamedata/Empire.js";

export class EmpireManager {
  private empires = new Map<EmpireId, Empire>();

  add(empire: Empire): void {
    this.empires.set(empire.id, empire);
  }

  get(id: EmpireId): Empire {
    const empire = this.empires.get(id);
    if (!empire) throw new Error(`Empire not found: ${id}`);
    return empire;
  }

  all(): Empire[] {
    return Array.from(this.empires.values());
  }
}
