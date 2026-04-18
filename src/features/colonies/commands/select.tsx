import React from "react";
import type { Command, CommandResult } from "src/commands/command.js";
import type { GameState } from "src/engine/GameState.js";
import type { Colony } from "src/engine/gamedata/Colony.js";
import SelectColonyDialog from "../ui/select-colony-dialog.js";

export function createSelectColonyCommand(
  { world }: GameState,
  onSelect: (colony: Colony) => void,
): Command {
  return {
    trigger: "s",
    name: "Select",
    description: "Select a colony",
    execute(): CommandResult {
      const colonies = world.currentPlayerEmpireId ? world.colonies.forEmpire(world.currentPlayerEmpireId) : [];
      return {
        dialog: (onClose) => <SelectColonyDialog colonies={colonies} onDone={onSelect} onClose={onClose} />,
      };
    },
  };
}
