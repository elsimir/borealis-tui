import React, { useMemo, useState, type ReactNode } from "react";
import Screen from "./screen.js";
import { listColonies } from "../features/colonies/commands/colonies-context.js";
import { showTimeControls } from "../features/clock/commands/clock-context.js";

export default function MainScreen() {
  const [output, setOutput] = useState<ReactNode>(null);

  const commands = useMemo(() => [
    listColonies(),
    showTimeControls(),
  ], []);

  return (
    <Screen commands={commands} onCommand={(_cmd, result) => {
      if (result.output !== undefined) setOutput(result.output);
    }}>
      {output}
    </Screen>
  );
}
