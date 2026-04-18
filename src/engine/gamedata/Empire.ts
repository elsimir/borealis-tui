export type EmpireId = string & { readonly _brand: "EmpireId" };

export function empireId(id: string): EmpireId {
  return id as EmpireId;
}

export class Empire {
  isPlayer: boolean = false;

  constructor(
    readonly id: EmpireId,
    readonly name: string,
    readonly color: string,
  ) {}
}
