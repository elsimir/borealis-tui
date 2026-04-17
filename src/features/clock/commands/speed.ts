import type { Command } from "src/commands/command.js";
import type { GameState } from "src/engine/GameState.js";
import { GameSpeed } from "src/engine/GameClock.js";

export function createSpeedUpCommand({ clock }: GameState): Command {
  return {
    trigger: "u",
    name: "Faster",
    description: "Increase clock speed",
    execute() {
      clock.setSpeed(GameSpeed.next(clock.getSpeed()));
    },
  };
}

export function createSpeedDownCommand({ clock }: GameState): Command {
  return {
    trigger: "d",
    name: "Slower",
    description: "Decrease clock speed",
    execute() {
      clock.setSpeed(GameSpeed.previous(clock.getSpeed()));
    },
  };
}
