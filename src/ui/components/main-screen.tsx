import React, { useMemo } from "react";
import Screen from "./screen.js";
import { useSetScreen } from "./screen-context.js";
import { listColonies } from "../../features/colonies/commands/colonies-context.js";

export default function MainScreen() {
  const { setScreen } = useSetScreen();

  const commands = useMemo(() => [
    listColonies(setScreen),
  ], [setScreen]);

  return <Screen commands={commands} />;
}
