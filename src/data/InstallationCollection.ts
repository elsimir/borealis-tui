import type { Installation } from "./schemas/installation.js";

export class InstallationCollection {
  private _index?: Map<string, Installation>;
  private _mining?: readonly Installation[];

  constructor(private readonly items: readonly Installation[]) {}

  all(): readonly Installation[] { return this.items; }

  miningInstallations(): readonly Installation[] {
    if (!this._mining) this._mining = this.items.filter((i) => "mining_points" in i.output);
    return this._mining;
  }

  byId(id: string): Installation | undefined {
    if (!this._index) this._index = new Map(this.items.map((i) => [i.id, i]));
    return this._index.get(id);
  }
}
