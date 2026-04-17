import React, { type ReactNode } from "react";
import { Box } from "ink";

interface OutputAreaProps {
  lines: ReactNode[];
  columns: number;
  rows: number;
}

export default function OutputArea({ lines, columns, rows }: OutputAreaProps) {
  const visible = lines.slice(-rows);

  return (
    <Box
      flexDirection="column"
      justifyContent="flex-start"
      width={columns}
      height={rows}
      paddingX={1}
      overflow="hidden"
    >
      {visible.map((node, i) => (
        <Box key={i}>{node}</Box>
      ))}
    </Box>
  );
}
