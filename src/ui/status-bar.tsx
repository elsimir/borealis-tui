import React from "react";
import { Box, Text } from "ink";
import Clock from "./clock.js";
import SpeedDisplay from "./speed-display.js";
import { GameClock } from "../engine/GameClock.js";

interface StatusBarProps {
  status: string;
  columns: number;
  clock: GameClock;
}

export default function StatusBar({ status, columns, clock }: StatusBarProps) {
  return (
    <Box width={columns} paddingX={1} justifyContent="space-between">
      <Text dimColor>{status}</Text>
      <Box gap={2}>
        <SpeedDisplay clock={clock} />
        <Clock clock={clock} />
      </Box>
    </Box>
  );
}
