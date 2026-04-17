# Borealis TUI

A terminal-based strategy/simulation game built with Ink (React for terminals) and TypeScript. The game runs on an internal clock measured in ticks, with each tick advancing simulated time by a configurable game speed.

## Build & verify

```
npm run build
```

Runs TypeScript compilation and bundling. Run this to verify changes.

## Structure

```
src/
  index.tsx          — entry point
  ui/                — Ink/React components and hooks
  engine/            — core engine systems shared across features (GameClock)
  commands/          — command infrastructure (Command, CommandRegistry, CommandContext, SubContextCommand)
  features/          — self-contained feature modules
    <feature>/
      ui/            — Ink/React components for the feature
      commands/      — commands provided by the feature
      engine/        — feature-specific engine logic (if needed)
```

Each feature mirrors the top-level `ui/`, `commands/`, and `engine/` layout but is scoped to its own domain. Features import from `src/engine/` and `src/commands/` for shared infrastructure; they do not import from each other or from `src/ui/`.

### Features

- **clock** — game clock display and pause control (`ui/clock.tsx`, `ui/speed-display.tsx`, `commands/pause.ts`)

## Commands

All input is processed as a command — there is no slash prefix. Typing `pause` dispatches the pause command directly. Commands are matched by keyword against the registry.

