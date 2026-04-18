import React from "react";
import type { ReactNode } from "react";
import type { Command } from "src/commands/command.js";
import ColoniesScreen from "../ui/components/colonies-screen.js";

export function listColonies(setScreen: (screen: ReactNode) => void): Command {
  return {
    trigger: "c",
    name: "Colonies",
    description: "Manage your colonies",
    onDispatch() { setScreen(<ColoniesScreen />); },
  };
}
