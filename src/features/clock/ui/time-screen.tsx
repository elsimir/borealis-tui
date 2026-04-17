import React, { useMemo, useState, type ReactNode } from "react";
import Screen from "src/ui/screen.js";
import { useGameState } from "src/ui/game-state-context.js";
import { createStepCommand } from "../commands/step.js";
import { createSpeedUpCommand, createSpeedDownCommand } from "../commands/speed.js";

export default function TimeScreen() {
  const gameState = useGameState();
  const [output, setOutput] = useState<ReactNode>(null);

  const commands = useMemo(() => [
    createStepCommand(gameState),
    createSpeedUpCommand(gameState),
    createSpeedDownCommand(gameState),
  ], [gameState]);

  return (
    <Screen commands={commands} context={["Time"]} onCommand={(_cmd, result) => {
      if (result.output !== undefined) setOutput(result.output);
    }}>
      {output}
    </Screen>
  );
}
