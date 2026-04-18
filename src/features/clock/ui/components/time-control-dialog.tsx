import React, { useEffect, useState } from "react";
import { Box, Text, useInput } from "ink";
import Dialog from "src/ui/components/dialog.js";
import { useGameState } from "src/ui/components/game-state-context.js";
import { GameSpeed, type GameClockState } from "src/engine/GameClock.js";

function Row({ keyHint, label }: { keyHint: string; label: string }) {
  return (
    <Box gap={2}>
      <Text bold color="cyan" dimColor>[{keyHint}]</Text>
      <Text>{label}</Text>
    </Box>
  );
}

export default function TimeControlDialog() {
  const { clock } = useGameState();
  const [state, setState] = useState<GameClockState>(clock.getState());
  const [speed, setSpeed] = useState(clock.getSpeed());

  useEffect(() => clock.onStateChange((s, sp) => { setState(s); setSpeed(sp); }), [clock]);

  useInput((input) => {
    if (input === "u") clock.setSpeed(GameSpeed.next(clock.getSpeed()));
    if (input === "d") clock.setSpeed(GameSpeed.previous(clock.getSpeed()));
    if (input === "s") { clock.pause(); clock.step(); }
  });

  const pauseLabel = state === "paused" ? "Resume" : "Pause";

  return (
    <Dialog title="Time Controls">
      <Box flexDirection="column" gap={1}>
        <Text dimColor>{GameSpeed.label(speed)}{state === "paused" ? " — Paused" : ""}</Text>
        <Box flexDirection="column">
          <Row keyHint="p" label={pauseLabel} />
          <Row keyHint="u" label="Faster" />
          <Row keyHint="d" label="Slower" />
          <Row keyHint="s" label="Step one tick" />
        </Box>
        <Text dimColor>Press t to close</Text>
      </Box>
    </Dialog>
  );
}
