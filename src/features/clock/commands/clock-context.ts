import { SubContextCommand } from "src/commands/sub-context-command.js";
import type { Command } from "src/commands/command.js";
import type { GameClock } from "src/engine/GameClock.js";
import { createSpeedUpCommand, createSpeedDownCommand } from "./speed.js";
import { createStepCommand } from "./step.js";

export class ClockSubContextCommand extends SubContextCommand {
  readonly keywords = ["t"];
  readonly description = "Control the game clock";
  readonly name = "Time";
  readonly subcommands: Command[];

  constructor(clock: GameClock) {
    super();
    this.subcommands = [
      createStepCommand(clock),
      createSpeedUpCommand(clock),
      createSpeedDownCommand(clock),
    ];
  }

  help(): string {
    return "Usage: time  —  enter the time context";
  }

  validate(): boolean {
    return true;
  }
}

export function createClockContext(clock: GameClock): ClockSubContextCommand {
  return new ClockSubContextCommand(clock);
}
