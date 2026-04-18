export interface Command {
  trigger: string;
  name: string;
  description: string;
  onDispatch(): void;
}
