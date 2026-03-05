# Delivery Workflow

## Current Delivery Model
- Repository now includes a Next.js application scaffold plus legacy static prototype screens.
- Build pipeline exists for Next.js app runtime; automated test runners are configured.

## Build and Test Commands

### Current (Observed)
- Build command: `npm run build`.
- Unit test command: `npm run test:unit`.
- Integration test command: `npm run test:integration`.
- Acceptance test command: `npm run test:acceptance`.
- Dev-story quick validation: `npm run dev-story:validate`.
- Dev-story post-manual regression: `npm run dev-story:post-manual`.

### Required Test Sequence Per Story
1. Implement story functionality.
2. Create/update unit, integration, and acceptance tests for story changes.
3. Print manual test steps in the implementation artifact.
4. Print the same manual test steps in the final dev-story completion message.
5. Run build + unit tests (`npm run dev-story:validate`) and fix failures.
6. Execute manual test checklist and record results.
7. Run integration tests (`npm run test:integration`).
8. Run acceptance tests (`npm run test:acceptance`).

### Deferral Exception
- Integration and/or acceptance may be deferred only on explicit user request.
- Deferral must be documented in the story artifact with reason and pending command(s).

### Next.js Runtime (Primary for migrated screens)
- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Open: `http://localhost:3000/`
- Migrated routes:
  - `/` (React Screen 1)
  - `/world-map`
  - `/topic-intro`
  - `/challenge`
- Legacy route compatibility is handled by redirects in `next.config.mjs`.

### Practical Local Preview (Manual)
- `python3 -m http.server 5173`
- Open:
  - `http://localhost:5173/src/ui/stitch/screen1-home-start-journey.html`
  - `http://localhost:5173/src/ui/stitch/screen2-world-map-topic-selection.html`
  - `http://localhost:5173/src/ui/stitch/screen3-grammar-topic-intro.html`
  - `http://localhost:5173/src/ui/stitch/screen4-game-challenge.html`

## Commit Checklist (Solo Developer)
- [ ] Scope is focused to one slice/bug/doc concern.
- [ ] Commit message follows project standard (title + Details section).
- [ ] Related planning docs updated when behavior changes.
- [ ] Route targets are valid (no broken screen links).
- [ ] Security baseline checklist reviewed.
- [ ] Unit tests executed and passing.
- [ ] Manual regression checklist executed.
- [ ] Integration + acceptance tests executed after manual checks.
- [ ] Any deferred test level has explicit user approval and documented follow-up command.
- [ ] `TBD` items added where implementation detail is unknown.

## Commit Message Convention (Required)

Use this exact structure:

```text
<type>: <short title>

Details:
- <implementation or bug-fix detail 1>
- <implementation or bug-fix detail 2>
- <related docs/tests update>
```

Allowed `<type>` values:
- `feat`, `fix`, `docs`, `refactor`, `test`

Minimum quality bar:
- Title is short and specific.
- Details explain what changed and why it matters.
- Implementation/bug-fix commits explicitly list impacted behavior.
- If docs changed, include doc updates in Details.

## PR / Review Checklist (Even in Solo Flow)
- [ ] Description includes what changed and why.
- [ ] List of touched files grouped by feature.
- [ ] Screenshots or short recording for UI-impacting changes.
- [ ] Known risks and rollback plan listed.
- [ ] Links to affected artifacts (`prd`, `functional requirements`, `slice plan`).

## Release Flow (Current)
1. Update planning + docs context for changed behavior.
2. Run Next.js build + unit tests (`npm run dev-story:validate`).
3. Print and execute manual browser smoke tests.
4. Run integration and acceptance tests after manual checks pass.
5. If user explicitly requests deferral, document the deferral and pending commands in the story artifact.
6. Resolve all blocking checklist items.
7. Tag release notes manually (`TBD` tag strategy).
8. Publish static files to chosen hosting target (`TBD` platform).

## Workflow TBDs
- Branch naming policy: TBD.
- CI checks and required gates: TBD.
- Environment matrix (dev/staging/prod): TBD.
- Hosting platform and rollback process: TBD.

## Source References
- `_bmad-output/planning-artifacts/implementation-slices-feature-and-screen-plan.md`
- `_bmad-output/planning-artifacts/google-stitch-handoff-guide.md`
- `src/ui/stitch/`
