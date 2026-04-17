import React from "react";
import type { Command } from "src/commands/command.js";
import TimeScreen from "../ui/time-screen.js";

export function showTimeControls(): Command {
  return {
    trigger: "t",
    name: "Time",
    description: "Control the game clock",
    execute() {
      return { nextScreen: <TimeScreen /> };
    },
  };
}
