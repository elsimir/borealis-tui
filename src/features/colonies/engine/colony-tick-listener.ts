import type { GameClockListener } from "src/engine/GameClock.js";
import type { GameWorld } from "src/engine/GameWorld.js";
import type { GameData } from "src/engine/GameData.js";
import { runColonyProduction, applyProductionResult } from "./production.js";

export class ColonyTickListener implements GameClockListener {
  constructor(private world: GameWorld, private data: GameData) {}

  needsInterrupt(): null {
    return null;
  }

  execute(_elapsedSeconds: number, productionSteps: number): void {
    if (productionSteps === 0) return;

    for (const colony of this.world.colonies.all()) {
      const body = this.world.systems.getBody(colony.bodyId);

      for (let i = 0; i < productionSteps; i++) {
        const result = runColonyProduction(colony, body, this.data, 0);
        applyProductionResult(colony, result);
      }
    }
  }
}
