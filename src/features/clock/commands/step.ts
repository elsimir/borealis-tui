import type { Command } from "src/commands/command.js";
import type { GameClock } from "src/engine/GameClock.js";

export function createStepCommand(clock: GameClock): Command {
  return {
    keywords: ["s"],
    name: "Step",
    description: "Advance one tick",
    help() {
      return "Usage: s  —  advance the game clock by one tick";
    },
    validate() {
      return true;
    },
    execute(_input, _ctx) {
      clock.step();
    },
  };
}
