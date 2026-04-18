import React from "react";
import type { ReactNode } from "react";
import type { Command } from "src/commands/command.js";
import TimeScreen from "../components/time-screen.js";

export function showTimeControls(setScreen: (screen: ReactNode) => void): Command {
  return {
    trigger: "t",
    name: "Time",
    description: "Control the game clock",
    onDispatch() { setScreen(<TimeScreen />); },
  };
}
