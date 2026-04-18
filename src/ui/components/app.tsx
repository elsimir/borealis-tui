import React, { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { Box, useApp, useInput } from "ink";
import { GameState } from "../../engine/GameState.js";
import { GameData } from "../../engine/GameData.js";
import { Logger } from "../../engine/Logger.js";
import { useDimensions } from "../hooks/use-dimensions.js";
import StatusBar from "./status-bar.js";
import MainScreen from "./main-screen.js";
import EventsBox from "./events-box.js";
import { ScreenContext } from "./screen-context.js";
import { SharedInputProvider } from "./shared-input.js";
import { GameStateContext } from "./game-state-context.js";
import TimeControlDialog from "../../features/clock/ui/components/time-control-dialog.js";
import { SelectedColonyProvider } from "../../features/colonies/ui/components/selected-colony-context.js";

export default function App({ data, logger }: { data: GameData; logger: Logger }) {
  const { exit } = useApp();
  const { columns, rows } = useDimensions();

  const gameState = useMemo(() => new GameState(data, logger), [data, logger]);

  useEffect(() => {
    gameState.clock.start();
    gameState.clock.pause();
    return () => {
      gameState.clock.stop();
      gameState.logger.close();
    };
  }, [gameState]);

  const [showTimeDialog, setShowTimeDialog] = useState(false);

  useInput((input) => {
    if (input === "t") setShowTimeDialog((prev) => !prev);
    if (input === "p") {
      if (gameState.clock.getState() === "paused") gameState.clock.resume();
      else gameState.clock.pause();
    }
  });

  const [screens, setScreens] = useState<ReactNode[]>(() => [<MainScreen />]);

  const setScreen = useCallback((screen: ReactNode) => {
    setScreens((prev) => [...prev, screen]);
  }, []);

  const replaceScreen = useCallback((screen: ReactNode) => {
    setScreens((prev) => [...prev.slice(0, -1), screen]);
  }, []);

  const popScreen = useCallback(() => {
    setScreens((prev) => {
      if (prev.length <= 1) { exit(); return prev; }
      return prev.slice(0, -1);
    });
  }, [exit]);

  return (
    <GameStateContext.Provider value={gameState}>
      <SelectedColonyProvider>
      <SharedInputProvider>
        <ScreenContext.Provider value={{ setScreen, replaceScreen, popScreen }}>
          <Box flexDirection="column" width={columns} height={rows}>
            <Box height={2} />
            <EventsBox />
            {screens[screens.length - 1]}
            <StatusBar />
            {showTimeDialog && <TimeControlDialog />}
          </Box>
        </ScreenContext.Provider>
      </SharedInputProvider>
      </SelectedColonyProvider>
    </GameStateContext.Provider>
  );
}
