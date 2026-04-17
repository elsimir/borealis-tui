import type { Command } from "./command.js";

export type DispatchResult =
  | { status: "not_found"; keyword: string }
  | { status: "invalid"; command: Command; input: string }
  | { status: "ok"; command: Command; input: string };

export class CommandRegistry {
  private commands: Command[] = [];
  private output: (text: string) => void;

  constructor(output: (text: string) => void) {
    this.output = output;
  }

  register(...commands: Command[]): this {
    this.commands.push(...commands);
    return this;
  }

  dispatch(raw: string): DispatchResult {
    const trimmed = raw.trim();
    const [keyword, ...rest] = trimmed.split(/\s+/);
    const input = rest.join(" ");

    const command = this.commands.find((c) =>
      c.keywords.includes(keyword.toLowerCase())
    );

    if (!command) {
      return { status: "not_found", keyword };
    }

    if (!command.validate(input)) {
      return { status: "invalid", command, input };
    }

    command.execute(input, this.output);
    return { status: "ok", command, input };
  }

  all(): Command[] {
    return [...this.commands];
  }
}
