import { type ReactNode } from "react";
import { useSharedInput } from "./shared-input.js";
import OutputArea from "./output-area.js";
import ContextBar from "./context-bar.js";
import CommandPanel from "./command-panel.js";
import type { Command } from "../../commands/command.js";
import { useSetScreen } from "./screen-context.js";

interface ScreenProps {
  commands: Command[];
  context?: string[];
  onBack?: () => void;
  children?: ReactNode;
}

export default function Screen({ commands, context = [], onBack, children }: ScreenProps) {
  const { popScreen } = useSetScreen();

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

    cmd.onDispatch();
  });

  return (
    <>
      <OutputArea>{children}</OutputArea>
      <ContextBar context={context} />
      <CommandPanel
        commands={commands}
        contextName={context[context.length - 1]}
        canGoBack={!!onBack || context.length > 0}
      />
    </>
  );
}
