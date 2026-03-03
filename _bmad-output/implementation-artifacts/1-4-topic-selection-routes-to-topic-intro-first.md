# Story 1.4: Topic Selection Routes to Topic Intro First

Status: done

## Story

As a learner,
I want every topic start to open intro first,
so that I always see rules and examples before challenge.

## Acceptance Criteria

1. Given the learner is on Screen 2 React route, when the learner presses `Start Topic`, then selected topic key is persisted to `gpa_selected_topic_v1`.
2. Given `Start Topic` is pressed, navigation routes to topic intro route first (`/screen3-grammar-topic-intro`) rather than challenge.
3. Topic intro route is available and renders selected topic label from persisted selection.
4. Existing profile hydration behavior remains available in Screen 2 and intro header.
5. `npm run build` passes.

## Tasks / Subtasks

- [x] Wire Screen 2 start action to intro-first route (AC: 1, 2)
  - [x] Persist `gpa_selected_topic_v1` on start
  - [x] Navigate to `/screen3-grammar-topic-intro`
- [x] Add React intro route scaffold (AC: 3)
  - [x] Create `app/screen3-grammar-topic-intro/page.js`
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
- Increased Screen 2 layout and topic card scale to visually align with Screen 1 onboarding sizing.
- Replaced hardcoded header rank text with progress-derived `Level X • Title` using grouped level bands.

### File List
- _bmad-output/implementation-artifacts/1-4-topic-selection-routes-to-topic-intro-first.md
- app/screen2-world-map-topic-selection/page.js
- app/screen3-grammar-topic-intro/page.js
- src/lib/playerLevel.js
- tests/unit/playerLevel.test.js
- _bmad-output/implementation-artifacts/sprint-status.yaml

### Change Log
- 2026-03-03: Implemented topic intro-first routing from Screen 2 and added intro route scaffold.
- 2026-03-03: Updated Screen 2 UI scale and added dynamic level-title badge from persisted progress.
