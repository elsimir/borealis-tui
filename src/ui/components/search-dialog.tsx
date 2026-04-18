import React, { useState } from "react";
import { Box, Text } from "ink";
import TextInput from "ink-text-input";
import Dialog from "./dialog.js";
import { useSharedInput } from "./shared-input.js";

interface SearchDialogProps {
  entries: string[];
  onSearch: (query: string) => void;
  onDone: (value: string) => void;
  onClose: () => void;
  title?: string;
}

export default function SearchDialog({
  entries,
  onSearch,
  onDone,
  onClose,
  title = "Search",
}: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  useSharedInput((_, key) => {
    if (key.escape) { onClose(); return true; }
    if (key.return) {
      const value = entries[selectedIndex] ?? query;
      onDone(value);
      return true;
    }
    if (key.upArrow) { setSelectedIndex((i) => Math.max(0, i - 1)); return true; }
    if (key.downArrow) { setSelectedIndex((i) => Math.min(entries.length - 1, i + 1)); return true; }
  });

  function handleChange(value: string) {
    setQuery(value);
    setSelectedIndex(0);
    onSearch(value);
  }

  return (
    <Dialog title={title}>
      <Box borderStyle="single" borderColor="cyan" paddingX={1}>
        <TextInput value={query} onChange={handleChange} placeholder="Type to search..." />
      </Box>
      <Box flexDirection="column" marginTop={1}>
        {entries.length === 0 && (
          <Text dimColor>  No results</Text>
        )}
        {entries.map((entry, i) => (
          <Box key={entry + i}>
            {i === selectedIndex
              ? <Text color="cyan" bold>{`> ${entry}`}</Text>
              : <Text>{`  ${entry}`}</Text>
            }
          </Box>
        ))}
      </Box>
    </Dialog>
  );
}
