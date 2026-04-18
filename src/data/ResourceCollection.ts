import type { Resource } from "./schemas/resource.js";

export class ResourceCollection {
  private _mineable?: readonly Resource[];

  constructor(private readonly items: readonly Resource[]) {}

  all(): readonly Resource[] { return this.items; }

  mineable(): readonly Resource[] {
    if (!this._mineable) this._mineable = this.items.filter((r) => r.mineable);
    return this._mineable;
  }
}
