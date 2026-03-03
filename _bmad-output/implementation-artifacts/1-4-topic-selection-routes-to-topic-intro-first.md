# Story 1.4: Topic Selection Routes to Topic Intro First

Status: done

## Story

As a learner,
I want every topic start to open intro first,
so that I always see rules and examples before challenge.

## Acceptance Criteria

1. Given the learner is on Screen 2 React route, when the learner presses `Start Topic`, then selected topic key is persisted to `gpa_selected_topic_v1`.
2. Given `Start Topic` is pressed, navigation routes to topic intro route first (`/topic-intro`) rather than challenge.
3. Topic intro route is available and renders selected topic label from persisted selection.
4. Existing profile hydration behavior remains available in Screen 2 and intro header.
5. `npm run build` passes.

## Tasks / Subtasks

- [x] Wire Screen 2 start action to intro-first route (AC: 1, 2)
  - [x] Persist `gpa_selected_topic_v1` on start
  - [x] Navigate to `/topic-intro`
- [x] Add React intro route scaffold (AC: 3)
  - [x] Create `app/topic-intro/page.js` (re-exporting `app/screen3-grammar-topic-intro/page.js`)
  - [x] Hydrate selected topic label from storage
- [x] Preserve profile context continuity (AC: 4)
  - [x] Keep header profile hydration in Screen 2
  - [x] Hydrate profile header in intro route
- [x] Validate implementation (AC: 5)
  - [x] Run `npm run build`

## Dev Notes

### Scope
- This story is strictly intro-first routing behavior from topic selection.
- Full intro rendering + voice controls is handled in Story 1.5.

## Dev Agent Record

### Agent Model Used
GPT-5.3-Codex

### Debug Log References
- `npm run build` (pass)
- `get_errors` on modified files

### Completion Notes List
- Updated Screen 2 start behavior to route into intro-first flow.
- Added React intro route scaffold with selected topic hydration.
- Preserved profile hydration on both Screen 2 and intro route headers.
- Refined Screen 2 map into a single-row horizontal carousel with four visible topic cards.
- Added edge-mounted left/right chevron controls, drag-to-scroll, and ArrowLeft/ArrowRight keyboard carousel navigation.
- Replaced helper text and dotted road connector with cleaner card-focused layout and side controls.
- Added companion dialog bubble (rounded rectangle with pointer tail) above the companion avatar.
- Updated companion avatar source to selected pet avatar mapping (fallback provided), avoiding human avatar default.
- Added easy-to-hard topic ordering and topic intro coverage for all map topics.
- Implemented dynamic topic state mapping from learner progress (`done`, `ongoing`, `locked`) and disabled interaction for locked topics.
- Added pet-dependent topic icon sets and rendered a secondary topic icon beside the status icon.
- Increased topic description readability and emphasized focused card via border glow/ring without scale distortion.

### File List
- _bmad-output/implementation-artifacts/1-4-topic-selection-routes-to-topic-intro-first.md
- app/topic-intro/page.js
- app/world-map/page.js
- app/screen2-world-map-topic-selection/page.js

### Change Log
- 2026-03-03: Implemented topic intro-first routing from Screen 2 and added intro route scaffold.
- 2026-03-03: Updated Screen 2 UI scale and added dynamic level-title badge from persisted progress.
- 2026-03-03: Added dynamic Screen 2 topic progression states, pet-dependent topic icon set, easy-to-hard ordering, and consistent white container styling.
- 2026-03-03: Converted Screen 2 to one-row horizontal carousel (4 visible cards) with edge chevrons, keyboard/drag navigation, dialog bubble companion callout, and selected-pet avatar usage.
- 2026-03-03: Adopted canonical clean routes `/world-map` and `/topic-intro`, with redirects from legacy `/screen2-world-map-topic-selection` and `/screen3-grammar-topic-intro`.
