import React, { useState, useEffect } from "react";
import { Text } from "ink";
import { GameClock, GameClockState, GameSpeed } from "src/engine/GameClock.js";

interface Props {
  clock: GameClock;
}

export default function SpeedDisplay({ clock }: Props) {
  const [speed, setSpeed] = useState(clock.getSpeed());
  const [state, setState] = useState<GameClockState>(clock.getState());

  useEffect(() => {
    return clock.onStateChange((s, sp) => {
      setState(s);
      setSpeed(sp);
    });
  }, [clock]);

  const label = state === "paused" ? "Paused" : GameSpeed.label(speed);

  return <Text dimColor>{label}</Text>;
}
