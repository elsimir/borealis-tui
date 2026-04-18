import React from "react";
import { render } from "ink";
import App from "./ui/components/app.js";
import { Logger } from "./engine/Logger.js";
import { GameDataLoader } from "./data/GameDataLoader.js";

const logger = new Logger();

function fatal(err: unknown): never {
  const message = err instanceof Error ? `${err.message}\n${err.stack}` : String(err);
  logger.error(`Fatal: ${message}`);
  logger.close();
  process.exit(1);
}

process.on("uncaughtException", fatal);
process.on("unhandledRejection", fatal);

try {
  const gameData = await new GameDataLoader(logger).load();
  render(<App data={gameData} logger={logger} />);
} catch (err) {
  fatal(err);
}
