import React, { useState } from "react";
import { Box, Text } from "ink";
import TextInput from "ink-text-input";
import Dialog from "src/ui/components/dialog.js";
import { useSharedInput } from "src/ui/components/shared-input.js";
import type { Installation } from "src/data/schemas/installation.js";

interface Props {
  installation: Installation;
  onDone: (count: number) => void;
  onClose: () => void;
}

export default function BuildCountDialog({ installation, onDone, onClose }: Props) {
  const [value, setValue] = useState("");

  useSharedInput((_, key) => {
    if (key.escape) { onClose(); return true; }
    if (key.return) {
      const count = parseInt(value, 10);
      if (count > 0) { onDone(count); }
      return true;
    }
  });

  function handleChange(input: string) {
    if (/^\d*$/.test(input)) setValue(input);
  }

  return (
    <Dialog title={installation.name}>
      <Box flexDirection="column" gap={1}>
        <Text>Number to build</Text>
        <Box borderStyle="single" borderColor="cyan" paddingX={1}>
          <TextInput value={value} onChange={handleChange} placeholder="0" />
        </Box>
      </Box>
    </Dialog>
  );
}
