import { createContext, useContext } from "react";
import type { GameState } from "../engine/GameState.js";

export const GameStateContext = createContext<GameState | null>(null);

export function useGameState(): GameState {
  const state = useContext(GameStateContext);
  if (!state) throw new Error("useGameState must be used within GameStateContext.Provider");
  return state;
}
