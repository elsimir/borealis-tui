import React from "react";
import { Box, Text } from "ink";

export interface Message {
  id: number;
  role: "user" | "assistant";
  text: string;
}

interface DisplayAreaProps {
  messages: Message[];
  columns: number;
  rows: number;
}

export default function DisplayArea({
  messages,
  columns,
  rows,
}: DisplayAreaProps) {
  // Show only as many messages as fit; newest at the bottom
  const visible = messages.slice(-rows);

  return (
    <Box
      flexDirection="column"
      justifyContent="flex-end"
      width={columns}
      height={rows}
      paddingX={1}
      overflow="hidden"
    >
      {visible.length === 0 ? (
        <Text dimColor>No messages yet.</Text>
      ) : (
        visible.map((msg) => (
          <Box key={msg.id}>
            {msg.role === "user" ? (
              <Text>
                <Text color="cyan" bold>{"you  "}</Text>
                {msg.text}
              </Text>
            ) : (
              <Text>
                <Text color="magenta" bold>{"  ✦  "}</Text>
                {msg.text}
              </Text>
            )}
          </Box>
        ))
      )}
    </Box>
  );
}
