import type { EmpireId } from "./Empire.js";
import type { PlanetId, SystemId } from "./StarSystem.js";

export type ColonyId = string & { readonly _brand: "ColonyId" };

export function colonyId(id: string): ColonyId {
  return id as ColonyId;
}

export type ResourceStockpile = Record<string, number>;

export interface Colony {
  id: ColonyId;
  name: string;
  empireId: EmpireId;
  systemId: SystemId;
  planetId: PlanetId;
  population: number;
  foundedAt: number;
  installations: Record<string, number>;
  stockpile: ResourceStockpile;
  stockpileDelta: ResourceStockpile;
}
