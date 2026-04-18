export type SystemId = string & { readonly _brand: "SystemId" };

export function systemId(id: string): SystemId {
  return id as SystemId;
}

export type StarType = "yellow" | "red_dwarf" | "blue_giant" | "white_dwarf" | "neutron";
export type BodyType = "rocky" | "oceanic" | "arid" | "arctic" | "gas_giant" | "barren";

export type BodyId = string & { readonly _brand: "BodyId" };

export function bodyId(id: string): BodyId {
  return id as BodyId;
}

export interface BodyResource {
  amount: number;
  accessibility: number;
}

export type BodyResources = Record<string, BodyResource>;

export interface Body {
  type: "planet";
  id: BodyId;
  name: string;
  bodyType: BodyType;
  resources: BodyResources;
}

export interface StarSystem {
  id: SystemId;
  name: string;
  starType: StarType;
  bodies: Body[];
  connections: SystemId[];
}
