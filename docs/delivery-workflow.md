# Delivery Workflow

## Current Delivery Model
- Repository currently contains static prototype screens and planning artifacts.
- No formal build pipeline, test runner, or deployment config is defined in repo.

## Build and Test Commands

### Current (Observed)
- Build command: `TBD` (no package/build system configured).
- Automated test command: `TBD` (no test framework configured).

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
- [ ] Manual regression checklist executed.
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
2. Run manual browser smoke tests.
3. Resolve all blocking checklist items.
4. Tag release notes manually (`TBD` tag strategy).
5. Publish static files to chosen hosting target (`TBD` platform).

## Workflow TBDs
- Branch naming policy: TBD.
- CI checks and required gates: TBD.
- Environment matrix (dev/staging/prod): TBD.
- Hosting platform and rollback process: TBD.

## Source References
- `_bmad-output/planning-artifacts/implementation-slices-feature-and-screen-plan.md`
- `_bmad-output/planning-artifacts/google-stitch-handoff-guide.md`
- `src/ui/stitch/`
