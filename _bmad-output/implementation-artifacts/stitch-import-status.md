# Stitch Import Status

## Imported Screens
- Screen 1: Home / Start Journey
  - Raw export: `_bmad-output/implementation-artifacts/stich-export/screen1-home-start-journey.html`
  - Working copy: `src/ui/stitch/screen1-home-start-journey.html`
- Screen 2: World Map / Topic Selection
   - Raw export: `_bmad-output/implementation-artifacts/stich-export/screen2-world-map-topic-selection.html`
   - Working copy: `src/ui/stitch/screen2-world-map-topic-selection.html`
   - Status: content imported and synced

## Immediate Next Steps
1. Generate and export Screen 3-4 from Stitch next:
   - Grammar Topic Intro
   - Challenge Screen
2. Save each raw HTML in `_bmad-output/implementation-artifacts/stich-export/`.
3. Copy working files to `src/ui/stitch/` using same naming style.
4. Once Screen 2-4 are in place, start Slice 1 wiring:
   - Name capture + local profile
   - Pet selection persistence
   - Start Adventure -> Topic Selection navigation
   - Topic Selection -> Topic Intro routing

## Naming Convention
- `screen1-home-start-journey.html`
- `screen2-world-map-topic-selection.html`
- `screen3-grammar-topic-intro.html`
- `screen4-challenge-screen.html`

## Notes
- Current raw export folder is spelled `stich-export` in workspace; kept unchanged to avoid breaking your current flow.
