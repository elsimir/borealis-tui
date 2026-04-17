import React, { useEffect, useMemo, useState } from "react";
import { Box, useApp, useInput } from "ink";
import { GameClock, GameSpeed } from "../engine/GameClock.js";
import { useDimensions } from "./use-dimensions.js";
import StatusBar from "./status-bar.js";
import ContextBar from "./context-bar.js";
import CommandPanel from "./command-panel.js";
import { CommandContext } from "../commands/context.js";
import { CommandRegistry } from "../commands/registry.js";
import { createPauseCommand } from "../features/clock/commands/pause.js";
import { createClockContext } from "../features/clock/commands/clock-context.js";

const STATUS_HEIGHT = 1;
const CONTEXT_BAR_HEIGHT = 2;

export default function App() {
  const { exit } = useApp();
  const { columns, rows } = useDimensions();

  const clock = useMemo(() => new GameClock(GameSpeed.OneDay), []);
  useEffect(() => {
    clock.start();
    clock.pause();
    return () => clock.stop();
  }, [clock]);

  const panelHeight = Math.floor(rows / 3);
  const gameAreaRows = rows - panelHeight - STATUS_HEIGHT - CONTEXT_BAR_HEIGHT;

  const ctx = useMemo(() => new CommandContext(() => {}), []);
  const [, forceUpdate] = useState(0);
  const [globalMode, setGlobalMode] = useState(false);

  useEffect(() => {
    return ctx.onStackChange(() => {
      setGlobalMode(false);
      forceUpdate((n) => n + 1);
    });
  }, [ctx]);

  const registry = useMemo(
    () => new CommandRegistry(ctx).register(createPauseCommand(clock), createClockContext(clock)),
    [ctx, clock]
  );

  useInput((input, key) => {
    if (key.escape) {
      if (globalMode) { setGlobalMode(false); return; }
      if (ctx.activeSubContext) ctx.popContext();
      else exit();
      return;
    }
    if (key.ctrl || key.meta || key.tab || key.return) return;
    if (input.length !== 1) return;

    if (ctx.activeSubContext) {
      if (input === "g") { setGlobalMode((m) => !m); return; }
      if (input === "b" && !globalMode) { ctx.popContext(); return; }
      if (globalMode) { registry.dispatchGlobal(input); return; }
    }

    registry.dispatch(input);
  });

  const activeCommands = registry.all();

  return (
    <Box flexDirection="column" width={columns} height={rows}>
      <Box width={columns} height={gameAreaRows} />
      <ContextBar ctx={ctx} columns={columns} />
      <CommandPanel
        commands={activeCommands}
        contextName={ctx.activeSubContext?.name}
        globalMode={globalMode}
        height={panelHeight}
        columns={columns}
        canGoBack={!!ctx.activeSubContext}
      />
      <StatusBar columns={columns} clock={clock} />
    </Box>
  );
}
