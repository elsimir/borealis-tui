import type { Command } from "src/commands/command.js";
import { GameClock, GameSpeed } from "src/engine/GameClock.js";

export function createSpeedUpCommand(clock: GameClock): Command {
  return {
    keywords: ["u"],
    name: "Faster",
    description: "Increase clock speed",
    help() {
      return "Usage: u  —  increase the game clock speed";
    },
    validate() {
      return true;
    },
    execute(_input, ctx) {
      const next = GameSpeed.next(clock.getSpeed());
      clock.setSpeed(next);
      ctx.output(`Speed: ${GameSpeed.label(next)}`);
    },
  };
}

export function createSpeedDownCommand(clock: GameClock): Command {
  return {
    keywords: ["d"],
    name: "Slower",
    description: "Decrease clock speed",
    help() {
      return "Usage: d  —  decrease the game clock speed";
    },
    validate() {
      return true;
    },
    execute(_input, ctx) {
      const prev = GameSpeed.previous(clock.getSpeed());
      clock.setSpeed(prev);
      ctx.output(`Speed: ${GameSpeed.label(prev)}`);
    },
  };
}
