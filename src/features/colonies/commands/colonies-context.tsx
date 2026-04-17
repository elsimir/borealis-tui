import React from "react";
import type { Command } from "src/commands/command.js";
import ColoniesScreen from "../ui/colonies-screen.js";

export function listColonies(): Command {
  return {
    trigger: "c",
    name: "Colonies",
    description: "Manage your colonies",
    execute() {
      return { nextScreen: <ColoniesScreen /> };
    },
  };
}
