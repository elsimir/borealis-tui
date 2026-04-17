export type EmpireId = string & { readonly _brand: "EmpireId" };

export function empireId(id: string): EmpireId {
  return id as EmpireId;
}

export interface Empire {
  id: EmpireId;
  name: string;
  isPlayer: boolean;
  color: string;
}
