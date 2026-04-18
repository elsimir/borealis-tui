import type { Colony, ColonyId } from "./gamedata/Colony.js";
import type { EmpireId } from "./gamedata/Empire.js";

export class ColonyManager {
  private colonies: Colony[] = [];

  add(colony: Colony): void {
    this.colonies.push(colony);
  }

  get(id: ColonyId): Colony {
    const colony = this.colonies.find((c) => c.id === id);
    if (!colony) throw new Error(`Colony not found: ${id}`);
    return colony;
  }

  all(): Colony[] {
    return this.colonies;
  }

  forEmpire(empireId: EmpireId): Colony[] {
    return this.colonies.filter((c) => c.empireId === empireId);
  }
}
