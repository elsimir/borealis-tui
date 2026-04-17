import React, { useEffect, useState } from "react";
import { Box, Text, useInput } from "ink";
import type { Command } from "../commands/command.js";
import { interactionColor } from "./colors.js";

interface Props {
  commands: Command[];
  contextName?: string;
  globalMode?: boolean;
  height: number;
  columns: number;
  canGoBack: boolean;
}

const KEY_WIDTH = 6;
const COLUMN_WIDTH = 38;
const COLUMN_GAP = 2;
const ROW_GAP = 1;
const BACK_HEIGHT = 2;
const DESC_WIDTH = COLUMN_WIDTH - KEY_WIDTH;
const HEADING_HEIGHT = 2;

type Item =
  | { type: "command"; cmd: Command; isGlobal: boolean }
  | { type: "heading"; label: string };

function itemHeight(item: Item): number {
  if (item.type === "heading") return HEADING_HEIGHT;
  const descLines = Math.ceil(item.cmd.description.length / DESC_WIDTH);
  return 1 + Math.max(1, descLines) + 1; // name + desc + marginBottom
}

function paginate(items: Item[], colHeight: number, maxCols: number): Item[][][] {
  const pages: Item[][][] = [];
  let page: Item[][] = [];
  let col: Item[] = [];
  let used = 0;

  function nextCol() {
    if (col.length > 0) page.push(col);
    col = [];
    used = 0;
    if (page.length >= maxCols) {
      pages.push(page);
      page = [];
    }
  }

  for (let i = 0; i < items.length; i++) {
    const item = items[i]!;
    const h = itemHeight(item);
    const guardH = item.type === "heading" && i + 1 < items.length
      ? h + itemHeight(items[i + 1]!)
      : h;
    if (used + guardH > colHeight && used > 0) nextCol();
    col.push(item);
    used += h;
  }
  if (col.length > 0) page.push(col);
  if (page.length > 0) pages.push(page);
  return pages;
}

function PageIndicator({ page, pageCount }: { page: number; pageCount: number }) {
  if (pageCount <= 1) return null;
  return (
    <Box gap={1}>
      <Text color={page > 0 ? interactionColor : "gray"}>←</Text>
      <Text dimColor>{page + 1}/{pageCount}</Text>
      <Text color={page < pageCount - 1 ? interactionColor : "gray"}>→</Text>
    </Box>
  );
}

function CommandRow({ cmd, keyColor }: { cmd: Command; keyColor: string }) {
  return (
    <Box flexDirection="row" marginBottom={1} width={COLUMN_WIDTH} paddingRight={COLUMN_GAP}>
      <Box width={KEY_WIDTH} alignSelf="flex-start">
        <Text color={keyColor} bold>{cmd.keywords[0]}</Text>
      </Box>
      <Box flexDirection="column" width={DESC_WIDTH}>
        <Text bold>{cmd.name}</Text>
        <Text dimColor wrap="wrap">{cmd.description}</Text>
      </Box>
    </Box>
  );
}

function GlobalCommandRow({ cmd, globalMode }: { cmd: Command; globalMode: boolean }) {
  return (
    <Box flexDirection="row" marginBottom={1} width={COLUMN_WIDTH} paddingRight={COLUMN_GAP}>
      <Box width={KEY_WIDTH} alignSelf="flex-start">
        {globalMode
          ? <Text color={interactionColor} bold>{cmd.keywords[0]}</Text>
          : <Text><Text color={interactionColor} bold>g+</Text><Text color="gray">{cmd.keywords[0]}</Text></Text>
        }
      </Box>
      <Box flexDirection="column" width={DESC_WIDTH}>
        <Text bold>{cmd.name}</Text>
        <Text dimColor wrap="wrap">{cmd.description}</Text>
      </Box>
    </Box>
  );
}

function renderItem(item: Item, globalMode: boolean, contextKeyColor: string) {
  if (item.type === "heading") {
    return (
      <Box key="heading-global" marginBottom={1}>
        <Text color={globalMode ? "cyan" : undefined} dimColor={!globalMode}>Global</Text>
      </Box>
    );
  }
  if (item.isGlobal) {
    return <GlobalCommandRow key={item.cmd.keywords[0]} cmd={item.cmd} globalMode={globalMode} />;
  }
  return <CommandRow key={item.cmd.keywords[0]} cmd={item.cmd} keyColor={contextKeyColor} />;
}

export default function CommandPanel({ commands, contextName, globalMode = false, height, columns, canGoBack }: Props) {
  const contextCmds = contextName ? commands.filter((c) => !c.global) : commands;
  const globalCmds = contextName ? commands.filter((c) => c.global) : [];

  const items: Item[] = [
    ...contextCmds.map((cmd) => ({ type: "command" as const, cmd, isGlobal: false })),
    ...(globalCmds.length > 0
      ? [{ type: "heading" as const, label: "Global" }, ...globalCmds.map((cmd) => ({ type: "command" as const, cmd, isGlobal: true }))]
      : []),
  ];

  const innerHeight = height - 2;
  const commandsHeight = canGoBack ? innerHeight - BACK_HEIGHT : innerHeight;
  const usableHeight = commandsHeight - 2 * ROW_GAP;
  const maxCols = Math.floor((columns - 2) / COLUMN_WIDTH);
  const pages = paginate(items, usableHeight, Math.max(1, maxCols));
  const pageCount = pages.length;

  const [page, setPage] = useState(0);

  useEffect(() => { setPage(0); }, [contextName]);

  useInput((_input, key) => {
    if (pageCount <= 1) return;
    if (key.rightArrow) setPage((p) => Math.min(p + 1, pageCount - 1));
    if (key.leftArrow) setPage((p) => Math.max(p - 1, 0));
  });

  const safePage = Math.min(page, Math.max(0, pageCount - 1));
  const pageItems = pages[safePage] ?? [];
  const contextKeyColor = globalMode ? "gray" : interactionColor;

  return (
    <Box width={columns} height={height} flexDirection="column">
      <Text color="cyan">{"─".repeat(columns)}</Text>
      <Box flexDirection="column" height={innerHeight} paddingX={1}>
        <Box flexDirection="column" flexWrap="wrap" height={commandsHeight} paddingTop={ROW_GAP} paddingBottom={ROW_GAP}>
          {pageItems.flat().map((item) => renderItem(item, globalMode, contextKeyColor))}
        </Box>
        {canGoBack && (
          <Box flexDirection="row">
            <Box width={KEY_WIDTH} flexDirection="column">
              <Text color={interactionColor} bold>b</Text>
              <Text color={interactionColor} bold>esc</Text>
            </Box>
            <Box flexDirection="column" flexGrow={1}>
              <Text bold>Back</Text>
              <Text dimColor>Return to previous context</Text>
            </Box>
            <PageIndicator page={safePage} pageCount={pageCount} />
          </Box>
        )}
      </Box>
      <Text color="cyan">{"─".repeat(columns)}</Text>
    </Box>
  );
}
