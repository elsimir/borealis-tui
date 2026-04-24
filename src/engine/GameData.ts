import type { ResourceCollection } from "../data/ResourceCollection.js";
import type { InstallationCollection } from "../data/InstallationCollection.js";
import type { Settings } from "../data/schemas/settings.js";

export class GameData {
  private static _instance: GameData;

  static get instance(): GameData {
    return GameData._instance;
  }

  static set instance(value: GameData) {
    if (GameData._instance) throw new Error("GameData already initialized");
    GameData._instance = value;
  }

  constructor(
    readonly resources: ResourceCollection,
    readonly installations: InstallationCollection,
    readonly settings: Settings,
  ) {}
}
