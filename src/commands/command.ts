export interface Command {
  keywords: string[];
  description: string;
  help(): string;
  validate(input: string): boolean;
  execute(input: string, output: (text: string) => void): void;
}
