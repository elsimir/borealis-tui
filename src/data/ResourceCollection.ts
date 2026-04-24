import type { Resource } from "./schemas/resource.js";

export function isMineable(resource: Resource): boolean {
  return resource.mineable === true;
}

export class ResourceCollection {
  private _mineable?: readonly Resource[];

  constructor(private readonly items: readonly Resource[]) {}

  all(): readonly Resource[] { return this.items; }

  mineable(): readonly Resource[] {
    if (!this._mineable) this._mineable = this.items.filter(isMineable);
    return this._mineable;
  }
}
