import type { ResourceCollection } from "../data/ResourceCollection.js";
import type { InstallationCollection } from "../data/InstallationCollection.js";
import type { Settings } from "../data/schemas/settings.js";

export class GameData {
  constructor(
    readonly resources: ResourceCollection,
    readonly installations: InstallationCollection,
    readonly settings: Settings,
  ) {}
}
