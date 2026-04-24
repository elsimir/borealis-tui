import { GameClock, GameSpeed } from "./GameClock.js";
import { GameWorld } from "./GameWorld.js";
import { generateGame } from "./generateGame.js";
import { GameData } from "./GameData.js";
import { Logger } from "./Logger.js";
import { ColonyTickListener } from "../features/colonies/engine/colony-tick-listener.js";

export class GameState {
  readonly world: GameWorld;
  readonly clock: GameClock;
  readonly data: GameData;
  readonly logger: Logger;

  constructor(data: GameData, logger: Logger) {
    this.logger = logger;
    this.data = data;
    this.world = generateGame(data);
    this.clock = new GameClock(GameSpeed.OneDay, data.settings.production_step);
    this.clock.addListener(new ColonyTickListener(this.world, this.data));
    this.logger.info("GameState initialized");
  }
}
