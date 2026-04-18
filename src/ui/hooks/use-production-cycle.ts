import { useEffect, useState } from "react";
import type { GameClockListener } from "../../engine/GameClock.js";
import { useGameState } from "../components/game-state-context.js";

export function useProductionCycle(): void {
  const { clock } = useGameState();
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const listener: GameClockListener = {
      needsInterrupt: () => null,
      execute: (_elapsed, productionSteps) => {
        if (productionSteps > 0) forceUpdate((n) => n + 1);
      },
    };
    return clock.addListener(listener);
  }, [clock]);
}
