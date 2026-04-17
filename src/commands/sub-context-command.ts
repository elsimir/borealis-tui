import type { Command } from "./command.js";
import type { CommandContext } from "./context.js";

export abstract class SubContextCommand implements Command {
  abstract keywords: string[];
  abstract description: string;
  abstract subcommands: Command[];

  get name(): string {
    throw new Error("Not implemented");
  }

  abstract help(): string;
  abstract validate(input: string): boolean;

  execute(_input: string, ctx: CommandContext): void {
    if (ctx.hasContext(this)) return;
    ctx.pushContext(this);
    ctx.output(`Changed context: ${this.name}`);
  }
}
