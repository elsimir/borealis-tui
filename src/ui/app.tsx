import React, { useEffect, useMemo, useState } from "react";
import { Box, useApp, useInput } from "ink";
import { GameClock, GameSpeed } from "../engine/GameClock.js";
import { useDimensions } from "./use-dimensions.js";
import DisplayArea, { Message } from "./display-area.js";
import InputBar from "./input-bar.js";
import StatusBar from "./status-bar.js";
import ContextBar from "./context-bar.js";
import { CommandContext } from "../commands/context.js";
import { CommandRegistry } from "../commands/registry.js";
import { echoCommand } from "../commands/echo.js";
import { createPauseCommand } from "../features/clock/commands/pause.js";
import { createClockContext } from "../features/clock/commands/clock-context.js";

// Fixed chrome heights (border top+bottom = 2, status = 1, context bar + top margin = 2)
const INPUT_HEIGHT = 3;
const STATUS_HEIGHT = 1;
const CONTEXT_BAR_HEIGHT = 2;

let nextId = 1;

function addId(role: Message["role"], text: string): Message {
  return { id: nextId++, role, text };
}

export default function App() {
  const { exit } = useApp();
  const { columns, rows } = useDimensions();

  const clock = useMemo(() => new GameClock(GameSpeed.OneDay), []);
  useEffect(() => {
    clock.start();
    return () => clock.stop();
  }, [clock]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const displayRows = rows - INPUT_HEIGHT - STATUS_HEIGHT - CONTEXT_BAR_HEIGHT;

  const ctx = useMemo(
    () => new CommandContext((text) => {
      setMessages((prev) => [...prev, addId("assistant", text)]);
    }),
    []
  );

  const registry = useMemo(
    () => new CommandRegistry(ctx).register(echoCommand, createPauseCommand(clock), createClockContext(clock)),
    [ctx, clock]
  );

  useInput((_input, key) => {
    if (key.escape) exit();
  });

  function handleSubmit(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, addId("user", trimmed)]);
    setInput("");

    const result = registry.dispatch(trimmed);

    if (result.status === "not_found") {
      setMessages((prev) => [
        ...prev,
        addId("assistant", `Unknown command: ${result.keyword}`),
      ]);
    } else if (result.status === "invalid") {
      setMessages((prev) => [
        ...prev,
        addId("assistant", result.command.help()),
      ]);
    }
  }

  return (
    <Box flexDirection="column" width={columns} height={rows}>
      <DisplayArea messages={messages} columns={columns} rows={displayRows} />
      <ContextBar ctx={ctx} columns={columns} />
      <InputBar
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        columns={columns}
      />
      <StatusBar columns={columns} clock={clock} />
    </Box>
  );
}
