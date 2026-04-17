import { useState, type ReactNode } from "react";
import { useSharedInput } from "./shared-input.js";
import OutputArea from "./output-area.js";
import ContextBar from "./context-bar.js";
import CommandPanel from "./command-panel.js";
import type { Command, CommandResult } from "../commands/command.js";
import { useSetScreen } from "./screen-context.js";

interface ScreenProps {
  commands: Command[];
  context?: string[];
  onBack?: () => void;
  onCommand?: (command: Command, result: CommandResult) => void;
  children?: ReactNode;
}

export default function Screen({ commands, context = [], onBack, onCommand, children }: ScreenProps) {
  const { popScreen, setScreen } = useSetScreen();
  const [dialog, setDialog] = useState<ReactNode>(null);

  useSharedInput((input, key) => {
    const isBack = key.escape || (input === "b" && !key.ctrl && !key.meta);
    if (isBack) {
      onBack ? onBack() : popScreen();
      return true;
    }

    const isIgnored = key.ctrl || key.meta || key.tab || key.return
      || input.length !== 1 || input === "p";
    if (isIgnored) return;

    const cmd = commands.find((c) => c.trigger === input);
    if (!cmd) return;

    const result = cmd.execute(input) ?? {};

    if (result.dialog !== undefined) {
      setDialog(result.dialog(() => setDialog(null)));
    }
    if (result.nextScreen !== undefined) setScreen(result.nextScreen);
    if (result.output !== undefined || result.nextScreen !== undefined || result.dialog !== undefined) {
      onCommand?.(cmd, result);
    }
  });

  const contextName = context[context.length - 1];

  return (
    <>
      <OutputArea>{children}</OutputArea>
      <ContextBar context={context} />
      <CommandPanel
        commands={commands}
        contextName={contextName}
        canGoBack={!!onBack || context.length > 0}
      />
      {dialog}
    </>
  );
}
