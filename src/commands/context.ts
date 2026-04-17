import type { SubContextCommand } from "./sub-context-command.js";

export class CommandContext {
  private readonly stack: SubContextCommand[] = [];
  private readonly outputFn: (text: string) => void;
  private readonly stackListeners: Set<(stack: readonly SubContextCommand[]) => void> = new Set();

  constructor(output: (text: string) => void) {
    this.outputFn = output;
  }

  get activeSubContext(): SubContextCommand | null {
    return this.stack.length > 0 ? this.stack[this.stack.length - 1]! : null;
  }

  hasContext(ctx: SubContextCommand): boolean {
    return this.stack.includes(ctx);
  }

  pushContext(ctx: SubContextCommand): void {
    this.stack.push(ctx);
    this.notifyStackListeners();
  }

  popContext(): SubContextCommand | undefined {
    const popped = this.stack.pop();
    this.notifyStackListeners();
    return popped;
  }

  clearContext(): void {
    this.stack.length = 0;
    this.notifyStackListeners();
  }

  onStackChange(callback: (stack: readonly SubContextCommand[]) => void): () => void {
    this.stackListeners.add(callback);
    return () => this.stackListeners.delete(callback);
  }

  output(text: string): void {
    this.outputFn(text);
  }

  private notifyStackListeners(): void {
    for (const cb of this.stackListeners) cb([...this.stack]);
  }
}
