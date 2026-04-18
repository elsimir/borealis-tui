import React, { useEffect, useState } from "react";
import { Box, Text } from "ink";
import Clock from "../../features/clock/ui/components/clock.js";
import SpeedDisplay from "../../features/clock/ui/components/speed-display.js";
import { type GameClockState } from "../../engine/GameClock.js";
import { interactionColor } from "../colors.js";
import { useDimensions } from "../hooks/use-dimensions.js";
import { useGameState } from "./game-state-context.js";

function PauseControl() {
  const { clock } = useGameState();
  const [state, setState] = useState<GameClockState>(clock.getState());
  useEffect(() => clock.onStateChange((s) => setState(s)), [clock]);
  const action = state === "paused" ? "unpause" : "pause";
  return (
    <Text>
      Press <Text color={interactionColor}>p</Text> to {action}
      {"  "}
      <Text color={interactionColor}>t</Text> for time controls
    </Text>
  );
}

export default function StatusBar() {
  const { clock } = useGameState();
  const { columns } = useDimensions();
  return (
    <Box width={columns} paddingX={1} justifyContent="space-between">
      <Text dimColor>press <Text color={interactionColor}>ctrl</Text> for shortcuts</Text>
      <Box gap={2}>
        <PauseControl />
        <SpeedDisplay clock={clock} />
        <Clock clock={clock} />
      </Box>
    </Box>
  );
}
