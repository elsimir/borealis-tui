import React, { useEffect, useMemo, useState } from "react";
import { Box, useApp, useInput } from "ink";
import { GameClock, GameSpeed } from "../engine/GameClock.js";
import { useDimensions } from "./use-dimensions.js";
import DisplayArea, { Message } from "./display-area.js";
import InputBar from "./input-bar.js";
import StatusBar from "./status-bar.js";
import { CommandRegistry } from "../commands/registry.js";
import { echoCommand } from "../commands/echo.js";
import { createPauseCommand } from "../commands/pause.js";

// Fixed chrome heights (border top+bottom = 2, status = 1)
const INPUT_HEIGHT = 3;
const STATUS_HEIGHT = 1;

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
  const [status, setStatus] = useState("ready");

  const displayRows = rows - INPUT_HEIGHT - STATUS_HEIGHT;

  const registry = useMemo(
    () =>
      new CommandRegistry((text) => {
        setMessages((prev) => [...prev, addId("assistant", text)]);
      }).register(echoCommand, createPauseCommand(clock)),
    []
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
      setStatus(`Unknown command: /${result.keyword}`);
    } else if (result.status === "invalid") {
      setMessages((prev) => [
        ...prev,
        addId("assistant", result.command.help()),
      ]);
      setStatus("ready");
    } else {
      setStatus("ready");
    }
  }

  return (
    <Box flexDirection="column" width={columns} height={rows}>
      <DisplayArea messages={messages} columns={columns} rows={displayRows} />
      <InputBar
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        columns={columns}
      />
      <StatusBar status={status} columns={columns} clock={clock} />
    </Box>
  );
}
