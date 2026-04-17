import React, { useState, useEffect } from "react";
import { Text } from "ink";
import { GameClock, GameClockState, GameSpeed } from "../engine/GameClock.js";

interface Props {
  clock: GameClock;
}

export default function SpeedDisplay({ clock }: Props) {
  const [speed, setSpeed] = useState(clock.getSpeed());
  const [state, setState] = useState<GameClockState>(clock.getState());

  useEffect(() => {
    const unsubTick = clock.addListener({
      needsInterrupt: () => null,
      execute() { setSpeed(clock.getSpeed()); },
    });
    const unsubState = clock.onStateChange(setState);
    return () => { unsubTick(); unsubState(); };
  }, [clock]);

  const label = state === "paused" ? "Paused" : GameSpeed.label(speed);

  return <Text dimColor>{label}</Text>;
}
