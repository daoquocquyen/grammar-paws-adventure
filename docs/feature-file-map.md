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
| F-00 | Home / Start Journey onboarding | Partial-High | `app/page.js`, `src/components/HeaderBlock.js`, `src/ui/stitch/screen1-home-start-journey.html` | React route implemented at `/` with validation for name + hero + companion selection, plus a dual-dialog hero/companion preview panel and center connector badge; shared header component used for consistent top-bar layout; legacy HTML retained during migration. |
| F-00B | Shared kid-friendly app background layer | Implemented | `app/layout.js`, `app/globals.css` | Global light-blue gradient with decorative kid/pet icons rendered behind all screens; screen routes use transparent page wrappers to reveal shared layer. |
| F-00A | Player state persistence + returning session restore | Partial-Med | `app/page.js`, `app/world-map/page.js`, `app/topic-intro/page.js`, `app/challenge/page.js`, `src/lib/playerStorage.js` | Profile now persists `playerId` and progress/accessories/attempt-history hydrate through player-scoped localStorage keys so switching learner names does not reuse prior learner XP/progress; full accessories UX and broader restore polish remain pending. |
| F-01 | World Map / Topic Selection | Partial-High | `app/world-map/page.js`, `src/components/HeaderBlock.js`, `src/lib/playerLevel.js`, `src/ui/stitch/screen2-world-map-topic-selection.html` | Canonical React route is `/world-map`; legacy `/screen2-world-map-topic-selection` is redirected via `next.config.mjs`. Includes shared header reuse, profile hydration, intro-first start-topic routing, easy-to-hard ordering, dynamic topic states (`done`/`ongoing`/`locked`), default focus on latest unlocked topic, auto-scroll to keep focused topic visible, pet-dependent topic icons, progress-derived level badge, and a one-row horizontal 4-card carousel with edge chevrons plus drag/keyboard navigation. |
| F-02 | Grammar Topic Intro + voice controls | Partial-High | `app/topic-intro/page.js`, `src/lib/topicCatalog.js`, `src/components/HeaderBlock.js`, `src/ui/stitch/screen3-grammar-topic-intro.html` | Canonical React route is `/topic-intro`; legacy `/screen3-grammar-topic-intro` is redirected via `next.config.mjs`. Implements anchored intro composition, shared header reuse, dynamic aspect-card rendering from centralized topic metadata, loading/error/content states, single speaker on/off voice control, and navigation-safe speech cancellation on page exit. |
| F-03 | Challenge screen | Partial | `app/challenge/page.js`, `src/lib/topicCatalog.js`, `src/lib/challengeQuestionSelection.js`, `src/lib/challengeScoring.js`, `src/ui/stitch/screen4-game-challenge.html` | React route `/challenge` exists; legacy `/screen4-game-challenge` is redirected via `next.config.mjs`. Question selection derives aspect IDs from shared topic metadata, pass/fail now uses XP gate (`earned_base_xp / max_base_xp >= 80%`) with second-try award `+8 XP`, challenge totals are base-XP only (bonus XP removed), and HUD progress uses a challenge milestone rail (`Challenge Progress` + earned/goal pills) where line-fill tracks completed questions and the terminal `Finish` marker activates on summary completion; full challenge engine remains pending. |
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
- Screen 3 CTA now routes to `/challenge`; full challenge gameplay logic is still pending.
- `_bmad-output/implementation-artifacts/stitch-import-status.md` does not include updated screen 3/4 import confirmation.
- No canonical storage schema file currently maps persisted profile/progress/accessory keys and version migration behavior.

## Next Mapping Maintenance Actions
- [ ] Migrate Screen 2 behavior from `src/ui/stitch` into `app/world-map/page.js`.
- [ ] Expand `/challenge` from route shell into full gameplay engine (question rendering, scoring, feedback, progression).
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
- `app/world-map/page.js`
- `app/topic-intro/page.js`
- `app/challenge/page.js`
- `src/lib/topicCatalog.js`
- `src/lib/playerLevel.js`
