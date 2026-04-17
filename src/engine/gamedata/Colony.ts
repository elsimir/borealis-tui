import type { EmpireId } from "src/engine/Empire";
import type { PlanetId, SystemId } from "src/engine/StarSystem";

export type ColonyId = string & { readonly _brand: "ColonyId" };

export function colonyId(id: string): ColonyId {
  return id as ColonyId;
}

export interface Colony {
  id: ColonyId;
  name: string;
  empireId: EmpireId;
  systemId: SystemId;
  planetId: PlanetId;
  population: number;
  foundedAt: number;
}
