import React, { useState } from "react";
import { Box, Text } from "ink";
import { useSharedInput } from "./shared-input.js";

export interface ColumnDef<T> {
  title: string;
  width: number;
  align?: "left" | "right";
  render: (item: T, selected: boolean) => React.ReactNode;
}

interface TableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  allowSelection?: boolean;
  emptyMessage?: string;
}

const CURSOR_WIDTH = 2;

export default function Table<T>({ columns, data, allowSelection = false, emptyMessage = "No data" }: TableProps<T>) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useSharedInput((_, key) => {
    if (!allowSelection || data.length === 0) return;
    if (key.upArrow) { setSelectedIndex((i) => Math.max(0, i - 1)); return true; }
    if (key.downArrow) { setSelectedIndex((i) => Math.min(data.length - 1, i + 1)); return true; }
  });

  const totalWidth = (allowSelection ? CURSOR_WIDTH : 0) + columns.reduce((sum, col) => sum + col.width, 0);

  return (
    <Box flexDirection="column">
      <Box>
        {allowSelection && <Box width={CURSOR_WIDTH} />}
        {columns.map((col, i) => (
          <Box key={i} width={col.width} justifyContent={col.align === "right" ? "flex-end" : "flex-start"}>
            <Text bold>{col.title}</Text>
          </Box>
        ))}
      </Box>
      <Text dimColor>{"─".repeat(totalWidth)}</Text>
      {data.length === 0 ? (
        <Text dimColor>{emptyMessage}</Text>
      ) : data.map((item, i) => {
        const selected = allowSelection && i === selectedIndex;
        return (
          <Box key={i}>
            {allowSelection && (
              <Box width={CURSOR_WIDTH}>
                <Text color="cyan">{selected ? ">" : ""}</Text>
              </Box>
            )}
            {columns.map((col, j) => (
              <Box key={j} width={col.width} justifyContent={col.align === "right" ? "flex-end" : "flex-start"}>
                <Text>{col.render(item, selected)}</Text>
              </Box>
            ))}
          </Box>
        );
      })}
    </Box>
  );
}
