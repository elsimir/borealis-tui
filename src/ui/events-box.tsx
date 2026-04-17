import React from "react";
import { Box, Text } from "ink";

const EVENTS_HEIGHT = 10;

interface Props {
  columns: number;
}

export const EVENTS_BOX_TOTAL_HEIGHT = EVENTS_HEIGHT + 1; // content + bottom border

export default function EventsBox({ columns }: Props) {
  return (
    <Box flexDirection="column" width={columns}>
      <Box height={EVENTS_HEIGHT} paddingX={1} />
      <Text color="cyan">{"─".repeat(columns)}</Text>
    </Box>
  );
}
