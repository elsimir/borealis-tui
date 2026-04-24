import type { Installation } from "./schemas/installation.js";

export function isMiningInstallation(installation: Installation): boolean {
  return "mining_points" in installation.output;
}

export function isConstructionInstallation(installation: Installation): boolean {
  return "build_points" in installation.output;
}

export class InstallationCollection {
  private _index?: Map<string, Installation>;
  private _mining?: readonly Installation[];
  private _construction?: readonly Installation[];

  constructor(private readonly items: readonly Installation[]) {}

  all(): readonly Installation[] { return this.items; }

  miningInstallations(): readonly Installation[] {
    if (!this._mining) this._mining = this.items.filter(isMiningInstallation);
    return this._mining;
  }

  constructionInstallations(): readonly Installation[] {
    if (!this._construction) this._construction = this.items.filter(isConstructionInstallation);
    return this._construction;
  }

  byId(id: string): Installation | undefined {
    if (!this._index) this._index = new Map(this.items.map((i) => [i.id, i]));
    return this._index.get(id);
  }
}
