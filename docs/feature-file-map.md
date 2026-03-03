# Feature-to-File Map

## Source-of-Truth Priority
1. Functional requirements: `_bmad-output/planning-artifacts/functional-requirements-mvp.md`
2. PRD scope: `_bmad-output/planning-artifacts/prd-mvp-grammar-paws-adventure.md`
3. Slice plan: `_bmad-output/planning-artifacts/implementation-slices-feature-and-screen-plan.md`
4. Next.js runtime files: `app/**/*.js`
5. Working legacy UI files: `src/ui/stitch/*.html`
6. Raw Stitch exports: `_bmad-output/implementation-artifacts/stich-export/*.html`

## Implemented vs Planned
| Feature ID | Feature | Status | Primary Files | Notes |
|---|---|---|---|---|
| F-00 | Home / Start Journey onboarding | Partial-High | `app/page.js`, `src/components/HeaderBlock.js`, `src/ui/stitch/screen1-home-start-journey.html` | React route implemented at `/` with validation and pet selection; shared header component used for consistent top-bar layout; legacy HTML retained during migration. |
| F-00B | Shared kid-friendly app background layer | Implemented | `app/layout.js`, `app/globals.css` | Global light-blue gradient with decorative kid/pet icons rendered behind all screens; screen routes use transparent page wrappers to reveal shared layer. |
| F-00A | Player state persistence + returning session restore | Planned | `src/ui/stitch/screen1-home-start-journey.html`, `src/ui/stitch/screen2-world-map-topic-selection.html`, `TBD` | Must persist and restore name, selected pet, topic progress, unlocked/equipped accessories from localStorage to avoid redo next day. |
| F-01 | World Map / Topic Selection | Partial-High | `app/screen2-world-map-topic-selection/page.js`, `src/components/HeaderBlock.js`, `src/lib/playerLevel.js`, `src/ui/stitch/screen2-world-map-topic-selection.html` | React route includes shared header reuse, profile hydration, intro-first start-topic routing, easy-to-hard ordering, dynamic topic states (`done`/`ongoing`/`locked`), pet-dependent topic icons, progress-derived level badge, and a one-row horizontal 4-card carousel with edge chevrons plus drag/keyboard navigation. |
| F-02 | Grammar Topic Intro + voice controls | Partial-High | `app/screen3-grammar-topic-intro/page.js`, `src/components/HeaderBlock.js`, `src/ui/stitch/screen3-grammar-topic-intro.html` | Next.js route implements anchored intro composition, shared header reuse, dynamic aspect-card rendering, loading/error/content states, and single speaker on/off voice control. |
| F-03 | Challenge screen | Prototype | `src/ui/stitch/screen4-game-challenge.html` | Static UI example; challenge engine and scoring logic not wired. |
| F-04 | Results + pass/fail feedback | Planned | `TBD` | Required by PRD/FR, screen file not present. |
| F-05 | Reward selection (1 of 3) | Planned | `TBD` | Required by PRD/FR, screen file not present. |
| F-06 | Pet home/customization | Planned | `TBD` | Required by PRD/FR, screen file not present. |
| F-07 | Evolution milestone celebration | Planned | `TBD` | Required by PRD/FR, screen file not present. |
| F-08 | Progress dashboard | Planned | `TBD` | Required by PRD/FR, screen file not present. |

## Artifact Mapping (Raw Export -> Working Copy)
| Raw Export | Working Copy | Status |
|---|---|---|
| `_bmad-output/implementation-artifacts/stich-export/screen1-home-start-journey.html` | `src/ui/stitch/screen1-home-start-journey.html` | Synced with local custom script additions |
| `_bmad-output/implementation-artifacts/stich-export/screen2-world-map-topic-selection.html` | `src/ui/stitch/screen2-world-map-topic-selection.html` | Synced with profile/topic wiring |
| `TBD` | `src/ui/stitch/screen3-grammar-topic-intro.html` | Working copy exists; raw export not listed in status file |
| `TBD` | `src/ui/stitch/screen4-game-challenge.html` | Working copy exists; naming differs from status convention |

## Known Mapping Gaps
- Dual runtime currently exists (React routes + legacy Stitch HTML); source ownership per feature must remain explicit.
- Naming mismatch:
  - Planned/status naming: `screen4-challenge-screen.html`
  - Existing file: `screen4-game-challenge.html`
- Screen 3 CTA currently links to non-existing `./screen4-challenge-screen.html`.
- `_bmad-output/implementation-artifacts/stitch-import-status.md` does not include updated screen 3/4 import confirmation.
- No canonical storage schema file currently maps persisted profile/progress/accessory keys and version migration behavior.

## Next Mapping Maintenance Actions
- [ ] Migrate Screen 2 behavior from `src/ui/stitch` into `app/screen2-world-map-topic-selection/page.js`.
- [ ] Define remaining migration sequence for screen 4 into Next.js route.
- [ ] Resolve screen 4 filename/link mismatch and update all references.
- [ ] Update `stitch-import-status.md` for current screen inventory.
- [ ] Define canonical localStorage schema for `name`, `selectedPet`, progress state, and accessory unlock/equip state (versioned key strategy).
- [ ] Add planned target file names for screens 5-9 after design freeze.
- [ ] Keep this map synchronized whenever a feature moves planned -> implemented.

## Source References
- `_bmad-output/planning-artifacts/prd-mvp-grammar-paws-adventure.md`
- `_bmad-output/planning-artifacts/functional-requirements-mvp.md`
- `_bmad-output/planning-artifacts/implementation-slices-feature-and-screen-plan.md`
- `_bmad-output/implementation-artifacts/stitch-import-status.md`
- `src/ui/stitch/screen1-home-start-journey.html`
- `src/ui/stitch/screen2-world-map-topic-selection.html`
- `src/ui/stitch/screen3-grammar-topic-intro.html`
- `src/ui/stitch/screen4-game-challenge.html`
- `app/page.js`
- `app/screen2-world-map-topic-selection/page.js`
- `src/lib/playerLevel.js`
