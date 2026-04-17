import { GameClock, GameSpeed } from "./GameClock.js";
import { GameWorld } from "./GameWorld.js";
import { generateGame, PLAYER_ID } from "./generateGame.js";
import type { EmpireId } from "./gamedata/Empire.js";

export class GameState {
  readonly world: GameWorld;
  readonly clock: GameClock;
  readonly playerId: EmpireId;

  constructor() {
    this.world = generateGame();
    this.clock = new GameClock(GameSpeed.OneDay);
    this.playerId = PLAYER_ID;
  }
}
