import React from "react";
import { Box, Text } from "ink";
import TextInput from "ink-text-input";

interface InputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  columns: number;
}

export default function InputBar({
  value,
  onChange,
  onSubmit,
  columns,
}: InputBarProps) {
  return (
    <Box
      width={columns}
      paddingX={1}
      borderStyle="round"
      borderColor="cyan"
      paddingY={0}
    >
      <Text color="cyan" bold>
        {"› "}
      </Text>
      <TextInput
        value={value}
        onChange={onChange}
        onSubmit={onSubmit}
        placeholder="Type a message..."
      />
    </Box>
  );
}
