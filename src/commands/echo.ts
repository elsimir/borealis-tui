import type { Command } from "./command.js";

export const echoCommand: Command = {
  keywords: ["echo"],
  description: "Print text to the display",
  help() {
    return "Usage: /echo <text>  —  prints <text> to the display";
  },
  validate(input) {
    return input.trim().length > 0;
  },
  execute(input, output) {
    output(input.trim());
  },
};
