import React from "react";
import { render } from "ink";
import App from "./ui/components/app.js";
import { Logger } from "./engine/Logger.js";
import { GameDataLoader } from "./data/GameDataLoader.js";

const logger = new Logger();
const gameData = await new GameDataLoader(logger).load();

render(<App data={gameData} logger={logger} />);
