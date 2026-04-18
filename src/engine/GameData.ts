import type { Resource } from "../data/schemas/resource.js";
import type { Installation } from "../data/schemas/installation.js";

export class GameData {
  constructor(
    readonly resources: readonly Resource[],
    readonly installations: readonly Installation[],
  ) {}
}
