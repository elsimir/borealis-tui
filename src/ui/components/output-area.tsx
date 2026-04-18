import React, { type ReactNode } from "react";
import { Box } from "ink";
import { useDimensions } from "../hooks/use-dimensions.js";

interface OutputAreaProps {
  children?: ReactNode;
}

export default function OutputArea({ children }: OutputAreaProps) {
  const { columns } = useDimensions();

  return (
    <Box
      flexDirection="column"
      justifyContent="flex-start"
      width={columns}
      flexGrow={1}
      paddingX={1}
      overflow="hidden"
    >
      {children}
    </Box>
  );
}
