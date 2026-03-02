# Google Stitch -> Implementation Handoff Guide

## Short Answer
Yes. Generate screens in Google Stitch first, then place the exported assets/code in this workspace. After that, I can wire state, business rules, and feature logic screen by screen.

## Recommended Workflow
1. Finalize screen list from PRD.
2. Generate screens in Google Stitch.
3. Export either:
   - **Option A (best):** React code export (or HTML/CSS if React not available)
   - **Option B:** Design export only (images/specs), then I recreate components in code
4. Import export into this repo under a dedicated folder.
5. Tell me the folder path and target stack, and I implement features on top.

## Workspace Import Structure
Create one of these folders:

- `_bmad-output/implementation-artifacts/stitch-export/` (raw export backup)
- `app/` or `src/` (actual app code I will implement in)

Recommended split:

- Keep raw Stitch files in `_bmad-output/implementation-artifacts/stitch-export/`
- Copy production-ready UI code into `app/` (or `src/`) for implementation

## What to Export from Stitch
For each screen, export:
- Screen name
- Component tree/layers
- Layout constraints (desktop + mobile if available)
- Typography, spacing, color tokens
- States (default/loading/empty/error)
- Interactions (button actions, transitions)

If Stitch can export code, include:
- Full code bundle
- Asset folder (icons/images)
- Any generated style/token file

## What You Should Send Me After Import
Provide these 5 items:
1. Target framework (`React`, `Next.js`, `Vue`, etc.)
2. Path to imported screens (example: `app/ui/stitch/`)
3. Which screen to implement first
4. Preferred styling approach (`Tailwind`, CSS modules, plain CSS)
5. Whether to preserve generated UI exactly or allow small refinements for usability

## Implementation Modes I Can Do
### Mode 1 — Direct Wiring (fastest)
Use Stitch-generated UI as-is, then connect:
- topic intro data
- challenge generation formula
- 80% pass rule
- answer explanations
- voice narration
- reward/evolution flow

### Mode 2 — Component Refactor (cleaner)
Convert generated screens into reusable components and shared layout primitives before wiring logic.

## If Stitch Exports Only Images or Specs
No problem. I can rebuild the UI from specs and keep visual parity. Include:
- PNG/SVG exports
- spacing/type/color specs
- interaction notes

## Suggested First Slice After Import
1. Topic Selection -> Topic Intro
2. Challenge Screen (question count + explanations)
3. Results (80% pass/fail)
4. Reward Selection

## Definition of Ready (before I start coding)
- At least 4 MVP screens imported (Topic Selection, Topic Intro, Challenge, Results)
- Assets resolve locally (no broken links)
- Chosen frontend stack confirmed
- One source-of-truth folder for UI code confirmed
