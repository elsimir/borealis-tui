import type { GameClockListener } from "src/engine/GameClock.js";
import type { GameWorld } from "src/engine/GameWorld.js";
import { runColonyConstruction, runColonyMining } from "./production.js";

export class ColonyTickListener implements GameClockListener {
  constructor(private world: GameWorld) {}

  needsInterrupt(): null {
    return null;
  }

  execute(_elapsedSeconds: number, productionSteps: number): void {
    if (productionSteps === 0) return;

    for (const colony of this.world.colonies.all()) {
      const body = this.world.systems.getBody(colony.bodyId);

      for (let i = 0; i < productionSteps; i++) {
        runColonyMining(colony, body);
        runColonyConstruction(colony);
      }
    }
  }
}
