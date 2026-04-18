import type { Command } from "src/commands/command.js";
import type { GameState } from "src/engine/GameState.js";

export function createStepCommand({ clock }: GameState): Command {
  return {
    trigger: "s",
    name: "Step",
    description: "Advance one tick",
    onDispatch() { clock.pause(); clock.step(); },
  };
}
