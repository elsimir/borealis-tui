export type SystemId = string & { readonly _brand: "SystemId" };

export function systemId(id: string): SystemId {
  return id as SystemId;
}

export type StarType = "yellow" | "red_dwarf" | "blue_giant" | "white_dwarf" | "neutron";
export type PlanetType = "rocky" | "oceanic" | "arid" | "arctic" | "gas_giant" | "barren";

export type PlanetId = string & { readonly _brand: "PlanetId" };

export function planetId(id: string): PlanetId {
  return id as PlanetId;
}

export interface PlanetResource {
  amount: number;
  accessibility: number;
}

export type PlanetResources = Record<string, PlanetResource>;

export interface Planet {
  id: PlanetId;
  name: string;
  type: PlanetType;
  resources: PlanetResources;
}

export interface StarSystem {
  id: SystemId;
  name: string;
  starType: StarType;
  planets: Planet[];
  connections: SystemId[];
}
