import React from "react";
import { Box, Text } from "ink";
import { useDimensions } from "../hooks/use-dimensions.js";

interface Props {
  context: string[];
}

export default function ContextBar({ context }: Props) {
  const { columns } = useDimensions();
  const breadcrumb = context.length > 0 ? context.join(" → ") : "—";
  return (
    <Box width={columns} paddingX={1} marginTop={1}>
      <Text dimColor>context  {breadcrumb}</Text>
    </Box>
  );
}
