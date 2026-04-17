import type { ReactNode } from "react";

export interface CommandResult {
  output?: ReactNode;
  dialog?: (onClose: () => void) => ReactNode;
  nextScreen?: ReactNode;
}

export interface Command {
  trigger: string;
  name: string;
  description: string;
  execute(input: string): CommandResult | undefined;
}
