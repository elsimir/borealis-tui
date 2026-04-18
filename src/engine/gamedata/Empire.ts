export type EmpireId = string & { readonly _brand: "EmpireId" };

export function empireId(id: string): EmpireId {
  return id as EmpireId;
}

export class Empire {
  constructor(
    readonly id: EmpireId,
    readonly name: string,
    readonly isPlayer: boolean,
    readonly color: string,
  ) {}
}
