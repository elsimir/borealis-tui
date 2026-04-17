import React, { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { Box, useApp, useInput } from "ink";
import { GameState } from "../engine/GameState.js";
import { useDimensions } from "./use-dimensions.js";
import StatusBar from "./status-bar.js";
import MainScreen from "./main-screen.js";
import EventsBox from "./events-box.js";
import { ScreenContext } from "./screen-context.js";
import { SharedInputProvider } from "./shared-input.js";
import { GameStateContext } from "./game-state-context.js";

export default function App() {
  const { exit } = useApp();
  const { columns, rows } = useDimensions();

  const gameState = useMemo(() => new GameState(), []);

  useEffect(() => {
    gameState.clock.start();
    gameState.clock.pause();
    return () => gameState.clock.stop();
  }, [gameState]);

  useInput((input) => {
    if (input === "p") {
      if (gameState.clock.getState() === "paused") gameState.clock.resume();
      else gameState.clock.pause();
    }
  });

  const [screens, setScreens] = useState<ReactNode[]>(() => [<MainScreen />]);

  const setScreen = useCallback((screen: ReactNode) => {
    setScreens((prev) => [...prev, screen]);
  }, []);

  const popScreen = useCallback(() => {
    setScreens((prev) => {
      if (prev.length <= 1) { exit(); return prev; }
      return prev.slice(0, -1);
    });
  }, [exit]);

  return (
    <GameStateContext.Provider value={gameState}>
      <SharedInputProvider>
        <ScreenContext.Provider value={{ setScreen, popScreen }}>
          <Box flexDirection="column" width={columns} height={rows}>
            <Box height={2} />
            <EventsBox />
            {screens[screens.length - 1]}
            <StatusBar />
          </Box>
        </ScreenContext.Provider>
      </SharedInputProvider>
    </GameStateContext.Provider>
  );
}
