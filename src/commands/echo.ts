import type { Command } from "./command.js";

export const echoCommand: Command = {
  keywords: ["echo"],
  name: "Echo",
  description: "Print text to the display",
  help() {
    return "Usage: /echo <text>  —  prints <text> to the display";
  },
  validate(input) {
    return input.trim().length > 0;
  },
  execute(input, ctx) {
    ctx.output(input.trim());
  },
};
