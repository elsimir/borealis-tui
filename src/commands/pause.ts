import type { Command } from "./command.js";
import type { GameClock } from "../engine/GameClock.js";

export function createPauseCommand(clock: GameClock): Command {
  return {
    keywords: ["p", "pause"],
    description: "Toggle pause",
    help() {
      return "Usage: /pause  —  toggles the game clock pause state";
    },
    validate() {
      return true;
    },
    execute(_input, output) {
      if (clock.getState() === "paused") {
        clock.resume();
        output("Resumed.");
      } else {
        clock.pause();
        output("Paused.");
      }
    },
  };
}
