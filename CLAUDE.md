# Borealis TUI

A terminal-based strategy/simulation game built with Ink (React for terminals) and TypeScript. The game runs on an internal clock measured in ticks, with each tick advancing simulated time by a configurable game speed.

## Build & verify

```
bun run typecheck   # fast type check, no emit
bun run build       # typecheck + compile to dist/borealis
bun run dev         # run directly from source (no compile step)
```

The project uses Bun as runtime and bundler. `bun run dev` runs TypeScript source directly. `bun run build` produces a single self-contained executable at `dist/borealis` via `bun build --compile`.

Type checking (`tsc --noEmit`) is a separate step from running — Bun strips types without checking them.

### Build: react-devtools-core / ws stubs

`shims/react-devtools-core` and `shims/ws` are local stub packages registered in `devDependencies`. Ink's reconciler contains a dynamic `import('./devtools.js')` guarded by `process.env.DEV === 'true'`, but Bun statically traces dynamic imports and tries to bundle `devtools.js`, which has static imports of `react-devtools-core` and `ws` (neither is a real dependency). The stubs satisfy the bundler; the devtools code path is never reached at runtime since `DEV` is not set. Do not remove these from `devDependencies`.

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

### UI conventions

Screen components (e.g. `ColoniesScreen`) are responsible for fetching and organising data from game state, then passing it down as props to presentational components. Presentational components receive plain data as props and do not access context or game state directly.

### Features

- **clock** — game clock display and pause control (`ui/clock.tsx`, `ui/speed-display.tsx`, `commands/pause.ts`)

## Data files

Game data lives in `data/` as YAML files and is loaded at startup via `src/data/GameDataLoader.ts`. Schemas are defined with Zod in `src/data/schemas/`.

**All YAML keys use `snake_case`** — this applies to field names in data files and to string keys used as identifiers within maps (e.g. resource IDs, output keys). TypeScript schema fields mirror this exactly; do not use camelCase in schemas or data files.

The build copies `data/` into `dist/data/` alongside the compiled binary. When adding a new data file, register it in `GameDataLoader` and add it to `GameData`.

## Commands

All input is processed as a command — there is no slash prefix. Commands are matched by their `trigger` against the registry.

**`trigger` must be a single character** (e.g. `"l"`, not `"list"`).

