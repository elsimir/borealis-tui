import { SubContextCommand } from "src/commands/sub-context-command.js";
import type { Command } from "src/commands/command.js";
import type { GameWorld } from "src/engine/GameWorld.js";
import type { EmpireId } from "src/engine/gamedata/Empire.js";
import { createListColoniesCommand } from "./list.js";

export class ColoniesSubContextCommand extends SubContextCommand {
  readonly keywords = ["c"];
  readonly description = "Manage your colonies";
  readonly name = "Colonies";
  readonly subcommands: Command[];

  constructor(world: GameWorld, playerId: EmpireId) {
    super();
    const list = createListColoniesCommand(world, playerId);
    this.subcommands = [list];
    this.defaultCommand = list;
  }

  help(): string {
    return "Usage: colonies  —  enter the colonies context";
  }

  validate(): boolean {
    return true;
  }
}

export function createColoniesContext(world: GameWorld, playerId: EmpireId): ColoniesSubContextCommand {
  return new ColoniesSubContextCommand(world, playerId);
}
