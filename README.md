# Borealis TUI

A terminal-based strategy/simulation game built with [Ink](https://github.com/vadimdemedes/ink) (React for terminals) and TypeScript. The game runs on an internal clock measured in ticks, with each tick advancing simulated time by a configurable game speed.

## Getting started

```
npm install
npm run build
node dist/index.js
```

Press `Escape` to quit.

## Project structure

```
src/
  index.tsx          — entry point
  ui/                — app shell (App, InputBar, DisplayArea, StatusBar)
  engine/            — core engine systems shared across features (GameClock)
  commands/          — command infrastructure (Command, CommandRegistry, CommandContext, SubContextCommand)
  features/          — self-contained feature modules
    <feature>/
      ui/            — Ink/React components for the feature
      commands/      — commands provided by the feature
      engine/        — feature-specific engine logic (if needed)
```

### Features

Each feature mirrors the top-level directory layout but is scoped to its own domain. Features import from `src/engine/` and `src/commands/` for shared infrastructure; they do not import from each other or from `src/ui/`.

| Feature | Description |
|---------|-------------|
| `clock` | Game clock display and pause control |

## Commands

All input is processed as a command — there is no slash prefix. Typing `pause` dispatches the pause command directly. Commands are matched by keyword against the registry.

| Command | Keywords | Description |
|---------|----------|-------------|
| Pause   | `pause`, `p` | Toggle the game clock pause state |
| Echo    | `echo`   | Echo text back to the display area |

## Build

```
npm run build
```

Runs TypeScript compilation and bundling via Vite.
