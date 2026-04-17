import type { CommandContext } from "./context.js";

export interface Command {
  keywords: string[];
  description: string;
  global?: boolean;
  help(): string;
  validate(input: string): boolean;
  execute(input: string, ctx: CommandContext): void;
}
