import type { Command } from "src/commands/command.js";

export function createSelectColonyCommand(onOpen: () => void): Command {
  return {
    trigger: "s",
    name: "Select",
    description: "Select a colony",
    onDispatch: onOpen,
  };
}
