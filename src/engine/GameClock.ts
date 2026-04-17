/**
 * A listener registered with the GameClock.
 *
 * Each tick, `needsInterrupt` is called first across all listeners. If any returns a
 * non-null value, the smallest returned value becomes the executeTime for that
 * tick (clamping it earlier than the full tick). `execute` is then called on
 * every listener with the final executeTime.
 */
export interface GameClockListener {
  needsInterrupt(elapsedSeconds: number, speed: GameSpeedOption): number | null;
  execute(elapsedSeconds: number): void;
}

export type GameClockState = "stopped" | "running" | "paused";

const BASE_TICK_MS = 2000; // real-time interval between ticks, always fixed at 2 s

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

/** In-game seconds elapsed per tick (tick fires every BASE_TICK_MS = 2 s). */
export type GameSpeedOption = typeof SPEED_VALUES[number];

/** In-game seconds elapsed per tick. Each tick fires every BASE_TICK_MS (2 s). */
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
    return `${SPEED_LABELS[SPEED_VALUES.indexOf(speed)]} / tick`;
  },
};

export class GameClock {
  private elapsedSeconds: number = 0;
  private state: GameClockState = "stopped";
  private speed: GameSpeedOption;
  private timer: ReturnType<typeof setInterval> | null = null;
  private listeners: Set<GameClockListener> = new Set();
  private stateListeners: Set<(state: GameClockState) => void> = new Set();

  constructor(speed: GameSpeedOption = GameSpeed.OneDay) {
    this.speed = speed;
  }

  setSpeed(speed: GameSpeedOption): void {
    this.speed = speed;
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

  onStateChange(callback: (state: GameClockState) => void): () => void {
    this.stateListeners.add(callback);
    return () => this.stateListeners.delete(callback);
  }

  private advance(): void {
    this.elapsedSeconds += this.speed;

    let executeTime = this.elapsedSeconds;
    for (const listener of this.listeners) {
      const eventAt = listener.needsInterrupt(this.elapsedSeconds, this.speed);
      if (eventAt !== null && eventAt < executeTime) executeTime = eventAt;
    }

    for (const listener of this.listeners) {
      listener.execute(executeTime);
    }
  }

  private notifyStateListeners(): void {
    for (const cb of this.stateListeners) cb(this.state);
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
