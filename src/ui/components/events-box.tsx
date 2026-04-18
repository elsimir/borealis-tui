import React from "react";
import { Box, Text } from "ink";
import { useDimensions } from "../hooks/use-dimensions.js";

const EVENTS_HEIGHT = 10;

export default function EventsBox() {
  const { columns } = useDimensions();
  return (
    <Box flexDirection="column" width={columns}>
      <Box height={EVENTS_HEIGHT} paddingX={1} />
      <Text color="cyan">{"─".repeat(columns)}</Text>
    </Box>
  );
}
