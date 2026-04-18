import { GameClock, GameSpeed } from "./GameClock.js";
import { GameWorld } from "./GameWorld.js";
import { generateGame, PLAYER_ID } from "./generateGame.js";
import { GameData } from "./GameData.js";
import { Logger } from "./Logger.js";
import { ColonyTickListener } from "../features/colonies/engine/colony-tick-listener.js";
import type { EmpireId } from "./gamedata/Empire.js";

export class GameState {
  readonly world: GameWorld;
  readonly clock: GameClock;
  readonly playerId: EmpireId;
  readonly data: GameData;
  readonly logger: Logger;

  constructor(data: GameData, logger: Logger) {
    this.logger = logger;
    this.data = data;
    this.world = generateGame(data);
    this.clock = new GameClock(GameSpeed.OneDay);
    this.playerId = PLAYER_ID;
    this.clock.addListener(new ColonyTickListener(this.world, this.data));
    this.logger.info("GameState initialized");
  }
}
