import React, { useState, useEffect } from "react";
import { Box, Text } from "ink";
import { CommandContext } from "../commands/context.js";
import type { SubContextCommand } from "../commands/sub-context-command.js";

interface Props {
  ctx: CommandContext;
  columns: number;
}

export default function ContextBar({ ctx, columns }: Props) {
  const [stack, setStack] = useState<readonly SubContextCommand[]>([]);

  useEffect(() => {
    return ctx.onStackChange(setStack);
  }, [ctx]);

  const breadcrumb = stack.length > 0 ? stack.map((c) => c.name).join(" → ") : "—";

  return (
    <Box width={columns} paddingX={1} marginTop={1}>
      <Text dimColor>context  {breadcrumb}</Text>
    </Box>
  );
}
