import React, { type ReactNode } from "react";
import { Box, Text } from "ink";
import { useDimensions } from "./use-dimensions.js";

interface DialogProps {
  title?: string;
  children: ReactNode;
}

export default function Dialog({ title, children }: DialogProps) {
  const { columns, rows } = useDimensions();
  const screenWidth = columns;
  const screenHeight = rows;
  const width = Math.floor(screenWidth / 3);
  const height = Math.floor(screenHeight / 3);

  return (
    <Box position="absolute" width={screenWidth} height={screenHeight} justifyContent="center" alignItems="center">
      <Box
        borderStyle="round"
        borderColor="cyan"
        width={width}
        height={height}
        flexDirection="column"
        paddingX={1}
      >
        {title && (
          <Box justifyContent="center" marginBottom={1}>
            <Text bold color="cyan">{title}</Text>
          </Box>
        )}
        {children}
      </Box>
    </Box>
  );
}
