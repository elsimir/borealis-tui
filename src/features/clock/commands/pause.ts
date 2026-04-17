import type { Command } from "src/commands/command.js";
import type { GameClock } from "src/engine/GameClock.js";

export function createPauseCommand(clock: GameClock): Command {
  return {
    keywords: ["p"],
    name: "Pause",
    description: "Pause/Unpause the game",
    global: true,
    help() {
      return "Usage: /pause  —  toggles the game clock pause state";
    },
    validate() {
      return true;
    },
    execute(_input, ctx) {
      if (clock.getState() === "paused") {
        clock.resume();
        ctx.output("Resumed.");
      } else {
        clock.pause();
        ctx.output("Paused.");
      }
    },
  };
}
