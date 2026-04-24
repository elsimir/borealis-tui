import { GameClock, GameSpeed } from "./GameClock.js";
import { GameWorld } from "./GameWorld.js";
import { generateGame } from "./generateGame.js";
import { GameData } from "./GameData.js";
import { Logger } from "./Logger.js";
import { ColonyTickListener } from "../features/colonies/engine/colony-tick-listener.js";

export class GameState {
  readonly world: GameWorld;
  readonly clock: GameClock;
  readonly logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
    this.world = generateGame();
    this.clock = new GameClock(GameSpeed.OneDay, GameData.instance.settings.production_step);
    this.clock.addListener(new ColonyTickListener(this.world));
    this.logger.info("GameState initialized");
  }
}
