import { SubContextCommand } from "src/commands/sub-context-command.js";
import type { Command } from "src/commands/command.js";
import type { GameClock } from "src/engine/GameClock.js";
import { createSpeedUpCommand, createSpeedDownCommand } from "./speed.js";

export class ClockSubContextCommand extends SubContextCommand {
  readonly keywords = ["clock", "c"];
  readonly description = "Enter clock context";
  readonly name = "Clock";
  readonly subcommands: Command[];

  constructor(clock: GameClock) {
    super();
    this.subcommands = [
      createSpeedUpCommand(clock),
      createSpeedDownCommand(clock),
    ];
  }

  help(): string {
    return "Usage: clock  —  enter the clock context";
  }

  validate(): boolean {
    return true;
  }
}

export function createClockContext(clock: GameClock): ClockSubContextCommand {
  return new ClockSubContextCommand(clock);
}
