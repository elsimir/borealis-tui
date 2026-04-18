import type { Colony, ColonyId } from "./gamedata/Colony.js";
import type { EmpireId } from "./gamedata/Empire.js";
import { Store } from "./Store.js";

export class ColonyManager {
  private colonies = new Store<Colony>("Colony");
  private byEmpire = new Map<EmpireId, ColonyId[]>();

  add(colony: Colony): void {
    this.colonies.add(colony);
    const ids = this.byEmpire.get(colony.empireId) ?? [];
    ids.push(colony.id);
    this.byEmpire.set(colony.empireId, ids);
  }

  get(id: ColonyId): Colony {
    return this.colonies.get(id);
  }

  all(): Colony[] {
    return this.colonies.all();
  }

  forEmpire(empireId: EmpireId): Colony[] {
    return (this.byEmpire.get(empireId) ?? []).map((id) => this.colonies.get(id));
  }
}
