import React, { useEffect, useMemo, useState } from "react";
import { Box, useApp, useInput } from "ink";
import { GameState } from "../../engine/GameState.js";
import { GameData } from "../../engine/GameData.js";
import { Logger } from "../../engine/Logger.js";
import { useDimensions } from "../hooks/use-dimensions.js";
import StatusBar from "./status-bar.js";
import MainScreen from "./main-screen.js";
import EventsBox from "./events-box.js";
import { SharedInputProvider } from "./shared-input.js";
import { GameStateContext } from "./game-state-context.js";
import TimeControlDialog from "../../features/clock/ui/components/time-control-dialog.js";

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

  return (
    <GameStateContext.Provider value={gameState}>
      <SharedInputProvider>
        <Box flexDirection="column" width={columns} height={rows}>
          <Box height={2} />
          <EventsBox />
          <MainScreen onBack={exit} />
          <StatusBar />
          {showTimeDialog && <TimeControlDialog />}
        </Box>
      </SharedInputProvider>
    </GameStateContext.Provider>
  );
}
