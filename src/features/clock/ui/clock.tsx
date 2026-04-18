import React, { useState, useEffect, useMemo } from "react";
import { Text } from "ink";
import { GameClock } from "src/engine/GameClock.js";

function midnightToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function format(date: Date): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  const HH = String(date.getHours()).padStart(2, "0");
  const MM = String(date.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${HH}:${MM}`;
}

interface Props {
  clock: GameClock;
}

export default function Clock({ clock }: Props) {
  const midnight = useMemo(midnightToday, []);
  const [display, setDisplay] = useState(() => format(midnight));

  useEffect(() => {
    return clock.addListener({
      needsInterrupt: () => null,
      execute(elapsedSeconds, _productionSteps) {
        const next = format(new Date(midnight.getTime() + elapsedSeconds * 1000));
        setDisplay(prev => prev === next ? prev : next);
      },
    });
  }, [clock, midnight]);

  return <Text color="#B8860B">{display}</Text>;
}
