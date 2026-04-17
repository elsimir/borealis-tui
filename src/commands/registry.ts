import type { Command } from "./command.js";
import type { CommandContext } from "./context.js";

export type DispatchResult =
  | { status: "not_found"; keyword: string }
  | { status: "invalid"; command: Command; input: string }
  | { status: "ok"; command: Command; input: string };

export class CommandRegistry {
  private commands: Command[] = [];
  private ctx: CommandContext;

  constructor(ctx: CommandContext) {
    this.ctx = ctx;
  }

  register(...commands: Command[]): this {
    this.commands.push(...commands);
    return this;
  }

  private activeCommands(): Command[] {
    if (!this.ctx.activeSubContext) return this.commands;
    const globals = this.commands.filter((c) => c.global);
    return [...this.ctx.activeSubContext.subcommands, ...globals];
  }

  dispatch(raw: string): DispatchResult {
    const trimmed = raw.trim();
    const [keyword, ...rest] = trimmed.split(/\s+/);
    const input = rest.join(" ");

    const command = this.activeCommands().find((c) =>
      c.keywords.includes(keyword.toLowerCase())
    );

    if (!command) {
      return { status: "not_found", keyword };
    }

    if (!command.validate(input)) {
      return { status: "invalid", command, input };
    }

    command.execute(input, this.ctx);
    return { status: "ok", command, input };
  }

  all(): Command[] {
    return [...this.activeCommands()];
  }
}
