import React from "react";
import { Box, Text } from "ink";
import Clock from "../features/clock/ui/clock.js";
import SpeedDisplay from "../features/clock/ui/speed-display.js";
import { GameClock } from "../engine/GameClock.js";

interface StatusBarProps {
  columns: number;
  clock: GameClock;
}

export default function StatusBar({ columns, clock }: StatusBarProps) {
  return (
    <Box width={columns} paddingX={1} justifyContent="space-between">
      <Text dimColor>press <Text color="#FF5555">ctrl</Text> for shortcuts</Text>
      <Box gap={2}>
        <SpeedDisplay clock={clock} />
        <Clock clock={clock} />
      </Box>
    </Box>
  );
}
