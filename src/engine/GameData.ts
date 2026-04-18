import type { ResourceCollection } from "../data/ResourceCollection.js";
import type { InstallationCollection } from "../data/InstallationCollection.js";

export class GameData {
  constructor(
    readonly resources: ResourceCollection,
    readonly installations: InstallationCollection,
  ) {}
}
