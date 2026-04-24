import type { Colony, ColonyId } from "./gamedata/Colony.js";
import type { EmpireId } from "./gamedata/Empire.js";
import { ConstructionQueue } from "./gamedata/ConstructionQueue.js";
import { Store } from "./Store.js";

type ColonyInit = Omit<Colony, "stockpileDelta" | "constructionQueue">;

export class ColonyManager {
  private colonies = new Store<Colony>("Colony");
  private byEmpire = new Map<EmpireId, ColonyId[]>();

  add(colony: ColonyInit): void {
    const full: Colony = {
      ...colony,
      stockpileDelta: {},
      constructionQueue: null!,
    };
    full.constructionQueue = new ConstructionQueue(full);
    this.colonies.add(full);
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
