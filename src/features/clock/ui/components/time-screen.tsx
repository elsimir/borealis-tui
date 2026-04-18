import React, { useMemo } from "react";
import Screen from "src/ui/components/screen.js";
import { useGameState } from "src/ui/components/game-state-context.js";
import { createStepCommand } from "../commands/step.js";
import { createSpeedUpCommand, createSpeedDownCommand } from "../commands/speed.js";

export default function TimeScreen() {
  const gameState = useGameState();

  const commands = useMemo(() => [
    createStepCommand(gameState),
    createSpeedUpCommand(gameState),
    createSpeedDownCommand(gameState),
  ], [gameState]);

  return <Screen commands={commands} context={["Time"]} />;
}
