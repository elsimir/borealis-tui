/** In-game seconds per production step (5 game-days). */
export const PRODUCTION_STEP_SECONDS = 5 * 24 * 60 * 60;

/**
 * Returned by `needsInterrupt` to request that a tick be cut short at `time`.
 *
 * - `soft` — clamp the tick to `time` and continue running; the remaining
 *   in-game time is deferred to the next real-time tick.
 * - `hard` — clamp the tick to `time` and pause the clock after executing,
 *   leaving the game stopped at exactly that moment.
 */
export interface Interrupt {
  time: number;
  kind: "soft" | "hard";
}

/**
 * A listener registered with the GameClock.
 *
 * Each tick, `needsInterrupt` is called first across all listeners. If any
 * returns a non-null value, the earliest time wins and its `kind` determines
 * whether the clock continues (`soft`) or pauses (`hard`) after executing.
 * `execute` is then called on every listener with the final executeTime.
 *
 * `productionSteps` is the number of full production steps (each =
 * PRODUCTION_STEP_SECONDS) that completed in this tick based on accumulated
 * game time since the last step. For `needsInterrupt` it is computed from the
 * full tick; for `execute` it reflects the actual (possibly clamped) elapsed
 * time.
 */
export interface GameClockListener {
  needsInterrupt(elapsedSeconds: number, speed: GameSpeedOption, productionSteps: number): Interrupt | null;
  execute(elapsedSeconds: number, productionSteps: number): void;
}

export type GameClockState = "stopped" | "running" | "paused";

const BASE_TICK_MS = 1000; // real-time interval between ticks, always fixed at 1 s

const SPEED_VALUES = [
  300,        //  5 min
  1_800,      // 30 min
  3_600,      //  1 hr
  21_600,     //  6 hrs
  43_200,     // 12 hrs
  86_400,     //  1 day
  432_000,    //  5 days
  2_592_000,  // 30 days
] as const;

const SPEED_LABELS = [
  "5 Min",
  "30 Min",
  "1 Hour",
  "6 Hours",
  "12 Hours",
  "1 Day",
  "5 Days",
  "30 Days",
] as const;

/** In-game seconds elapsed per tick (tick fires every BASE_TICK_MS = 1 s). */
export type GameSpeedOption = typeof SPEED_VALUES[number];

/** In-game seconds elapsed per tick. Each tick fires every BASE_TICK_MS (1 s). */
export const GameSpeed = {
  FiveMinutes:   SPEED_VALUES[0],
  ThirtyMinutes: SPEED_VALUES[1],
  OneHour:       SPEED_VALUES[2],
  SixHours:      SPEED_VALUES[3],
  TwelveHours:   SPEED_VALUES[4],
  OneDay:        SPEED_VALUES[5],
  FiveDays:      SPEED_VALUES[6],
  ThirtyDays:    SPEED_VALUES[7],

  /** All speeds in ascending order. */
  speeds: SPEED_VALUES as readonly GameSpeedOption[],

  /** Returns the next faster speed, or the current speed if already at max. */
  next(speed: GameSpeedOption): GameSpeedOption {
    const i = SPEED_VALUES.indexOf(speed);
    return i < SPEED_VALUES.length - 1 ? SPEED_VALUES[i + 1] as GameSpeedOption : speed;
  },

  /** Returns the next slower speed, or the current speed if already at min. */
  previous(speed: GameSpeedOption): GameSpeedOption {
    const i = SPEED_VALUES.indexOf(speed);
    return i > 0 ? SPEED_VALUES[i - 1] as GameSpeedOption : speed;
  },

  /** Returns the display label for a given speed. */
  label(speed: GameSpeedOption): string {
    return `Time increment: ${SPEED_LABELS[SPEED_VALUES.indexOf(speed)]}`;
  },
};

export class GameClock {
  private elapsedSeconds: number = 0;
  private secondsSinceLastProduction: number = 0;
  private state: GameClockState = "stopped";
  private speed: GameSpeedOption;
  private timer: ReturnType<typeof setInterval> | null = null;
  private listeners: Set<GameClockListener> = new Set();
  private stateListeners: Set<(state: GameClockState, speed: GameSpeedOption) => void> = new Set();

  constructor(speed: GameSpeedOption = GameSpeed.OneDay) {
    this.speed = speed;
  }

  setSpeed(speed: GameSpeedOption): void {
    this.speed = speed;
    this.notifyStateListeners();
  }

  getSpeed(): GameSpeedOption {
    return this.speed;
  }

  start(): void {
    if (this.state === "running") return;
    this.state = "running";
    this.startTimer();
    this.notifyStateListeners();
  }

  pause(): void {
    if (this.state !== "running") return;
    this.state = "paused";
    this.clearTimer();
    this.notifyStateListeners();
  }

  resume(): void {
    if (this.state !== "paused") return;
    this.state = "running";
    this.startTimer();
    this.notifyStateListeners();
  }

  stop(): void {
    this.state = "stopped";
    this.clearTimer();
    this.elapsedSeconds = 0;
    this.notifyStateListeners();
  }

  /** Manually advance the clock by one tick (useful for testing or turn-based modes). */
  step(): void {
    this.advance();
  }

  getElapsedSeconds(): number {
    return this.elapsedSeconds;
  }

  getState(): GameClockState {
    return this.state;
  }

  addListener(listener: GameClockListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  onStateChange(callback: (state: GameClockState, speed: GameSpeedOption) => void): () => void {
    this.stateListeners.add(callback);
    return () => this.stateListeners.delete(callback);
  }

  private advance(): void {
    const target = this.elapsedSeconds + this.speed;

    while (this.elapsedSeconds < target) {
      const prevElapsed = this.elapsedSeconds;
      const remaining = target - prevElapsed;

      const speculativeSteps = Math.floor(
        (this.secondsSinceLastProduction + remaining) / PRODUCTION_STEP_SECONDS,
      );

      let interrupt: Interrupt | null = null;
      for (const listener of this.listeners) {
        const candidate = listener.needsInterrupt(target, this.speed, speculativeSteps);
        if (candidate !== null && (interrupt === null || candidate.time < interrupt.time)) {
          interrupt = candidate;
        }
      }

      const executeTime = interrupt !== null ? Math.min(interrupt.time, target) : target;

      const tickSeconds = executeTime - prevElapsed;
      this.secondsSinceLastProduction += tickSeconds;
      const productionSteps = Math.floor(this.secondsSinceLastProduction / PRODUCTION_STEP_SECONDS);
      this.secondsSinceLastProduction -= productionSteps * PRODUCTION_STEP_SECONDS;

      this.elapsedSeconds = executeTime;

      for (const listener of this.listeners) {
        listener.execute(executeTime, productionSteps);
      }

      if (interrupt?.kind === "hard") {
        this.pause();
        return;
      }
    }
  }

  private notifyStateListeners(): void {
    for (const cb of this.stateListeners) cb(this.state, this.speed);
  }

  private startTimer(): void {
    this.timer = setInterval(() => this.advance(), BASE_TICK_MS);
  }

  private clearTimer(): void {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
