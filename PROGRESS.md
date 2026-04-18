# Borealis TUI — In Progress

**Date:** 2026-04-18

## What was built this session

### Data system
- `data/resources.yaml` — 6 mineable resources: water, volatiles, light_metals, heavy_metals, noble_metals, fissiles
  - Each has `base_value`, `mineable: true`, `rarity: common | uncommon | rare`
  - Rarity is internal only — not shown in any UI
- `data/installations.yaml` — mine, factory, research_lab
  - All output values are **yearly rates** — the engine scales to 5/365 per production step
  - mine: `mining_points: 5`; factory: `build_points: 3`; research_lab: `research: 2`
- `src/data/GameDataLoader.ts` — loads YAML at startup, handles dev vs compiled binary path correctly
  - Compiled binary: resolves `data/` relative to `process.argv[0]` (actual executable)
  - Dev mode: resolves relative to source entry point

### Engine
- `Colony` — gained `installations`, `stockpile`, `stockpileDelta` fields
- `Planet` / `PlanetResources` — `resources: Record<resourceId, { amount, accessibility }>`
- `generatePlanetResources.ts` — power-curve rarity system
  - common (power 0.7), uncommon (power 2.0), rare (power 4.0)
  - All resources have 50% chance of being present regardless of rarity
  - Homeworld flag: amount 200k–1M, accessibility 0.5–1.0; otherwise full range
- `GameClock.ts` — added `PRODUCTION_STEP_SECONDS` (5 game-days, exported), `secondsSinceLastProduction` tracking
  - `GameClockListener.needsInterrupt(elapsed, speed, productionSteps)` — speculativeSteps from full tick
  - `GameClockListener.execute(elapsed, productionSteps)` — final steps from actual (clamped) elapsed

### Colonies feature
- `src/features/colonies/engine/production.ts` — `runColonyProduction` + `applyProductionResult`
  - Handles `mining_points` virtual output → per-resource extraction via accessibility
  - Direct outputs (build_points, research) go straight to stockpile
  - **Not yet wired up** — production is not called anywhere on clock ticks yet
- `src/features/colonies/ui/colony-resources-screen.tsx` — resource table per colony
  - Columns: Resource | Planet Amt | Access | Mining/yr | Stockpile | Δ/tick
  - Mining/yr and Δ/tick colour-coded green/red

## What needs doing next

### 1. Wire production into the game loop (most important)
`production.ts` exists but is never called. Need a listener registered with `GameClock` that:
- On each `execute(elapsed, productionSteps)`, runs `runColonyProduction` + `applyProductionResult` for every colony once per `productionSteps`
- Likely lives in a new `src/features/colonies/engine/colony-tick-listener.ts` or similar
- Needs access to `GameWorld` and `GameData`

### 2. Non-mineable resource outputs not tracked
`mining_points` drives minerals, but `build_points` and `research` outputs from factory/research_lab go into `stockpile` — there's nowhere to spend or display them yet.

### 3. Colony details screen is minimal
`colony-details-screen.tsx` shows name, population, installations, and has an `"r"` command to open the resources screen. Could use:
- Population display formatting (currently raw number)
- Installations as a proper list with counts

### 4. No save/load
Game state is generated fresh on every run via `generateGame`. Persistence not started.

## Key conventions to remember
- All YAML keys are `snake_case` — field names and string identifiers
- Installation outputs are yearly rates — engine always scales by `STEP_FRACTION = 5/365`
- `rarity` field on resources is internal — never surface it in UI text
- `PRODUCTION_STEP_SECONDS` lives in `GameClock.ts` and is imported from there (not from feature code)
