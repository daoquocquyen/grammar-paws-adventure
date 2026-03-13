# Story 1.8: Home Player Select and Onboarding Route Split

Status: done

## Story

As a learner,
I want home to show existing player cards and a New Adventurer button,
so that I can continue an existing journey quickly or go to onboarding for a new profile.

## Acceptance Criteria

1. Given the learner opens `/` and no saved player profiles exist, then app redirects to `/onboarding`.
2. Given the learner opens `/`, when saved player profiles exist, then the page shows existing users with larger `hero/pet avatars` and detailed learner info including `Active Topic`.
3. Given the learner clicks `New Adventurer` on `/`, then the app routes to `/onboarding`.
4. Given the learner clicks an existing user card, then active profile context is set and app routes to `/world-map` for that learner.
5. Given onboarding starts from `/onboarding`, when valid name + hero + pet are selected, then profile persists and app routes to `/world-map`.
6. Existing persistence behavior remains backward-safe (player-scoped progress/accessories keys, active profile compatibility).

## Tasks / Subtasks

- [x] Split entry routes into player-select home and onboarding flow (AC: 1, 2, 4)
  - [x] Move existing onboarding implementation from `app/page.js` to `app/onboarding/page.js`
  - [x] Replace `app/page.js` with player-select home UI
  - [x] Keep onboarding validation and persistence behavior intact
- [x] Add profile-directory persistence support (AC: 1, 3, 5)
  - [x] Add `gpa_player_profiles_v1` helper functions in `src/lib/playerStorage.js`
  - [x] Upsert active profiles from onboarding and home-selection flows
- [x] Keep returning-state bootstrap behavior stable (AC: 3, 5)
  - [x] Extract returning-state initialization helper (`src/lib/returningState.js`)
  - [x] Reuse helper in onboarding and existing-user selection
- [x] Update tests for route split and add Story 1.8 coverage (AC: 1-5)
  - [x] Update onboarding-focused tests to use `/onboarding`
  - [x] Add unit/integration/acceptance tests for Story 1.8 player-select behavior

## Manual Test Steps

1. Open `/` with no existing profiles and verify automatic redirect to `/onboarding`.
2. Complete onboarding with name + hero + pet and verify routing to `/world-map`.
3. Return to `/` and verify saved user cards are full-width and display larger hero/pet avatars with detailed metadata including `Active Topic`.
4. Click `New Adventurer` from `/` and verify routing to `/onboarding`.
5. Click saved user card and verify direct routing to `/world-map` with that active learner context.
6. Switch to another learner on onboarding and verify scoped progress/accessory keys remain isolated.

## Dev Agent Record

### Agent Model Used
GPT-5 Codex

### Debug Log References
- `npm run dev-story:validate` (pass, escalated run due sandbox EXDEV filesystem rename issue)
- `npm run test:integration` (pass)
- `npm run test:acceptance` (pass, escalated run due sandbox port-bind restriction)

### Completion Notes List
- Implemented route split: `/` is now existing-user player-select, `/onboarding` is onboarding setup.
- Added profile-directory storage (`gpa_player_profiles_v1`) with read/upsert/bootstrap helpers.
- Preserved active profile and player-scoped returning-state behavior while selecting existing users.
- Updated all impacted onboarding acceptance tests to start from `/onboarding`.
- Added Story 1.8 tests:
  - `tests/unit/story-1-8-home-player-select.unit.test.js`
  - `tests/integration/story-1-8-home-player-select.integration.test.jsx`
  - `tests/acceptance/story-1-8-home-player-select.acceptance.spec.js`
- Manual test checklist is documented above; automated integration/acceptance coverage executed successfully.

### File List
- _bmad-output/implementation-artifacts/1-8-home-player-select-and-onboarding-route-split.md
- app/page.js
- app/onboarding/page.js
- src/lib/playerStorage.js
- src/lib/returningState.js
- tests/unit/story-1-8-home-player-select.unit.test.js
- tests/integration/story-1-8-home-player-select.integration.test.jsx
- tests/acceptance/story-1-8-home-player-select.acceptance.spec.js
- tests/acceptance/story-1-1-onboarding-validation.acceptance.spec.js
- tests/acceptance/story-1-2-profile-persistence.acceptance.spec.js
- tests/acceptance/story-1-3-returning-state.acceptance.spec.js
- tests/acceptance/story-1-4-topic-routing.acceptance.spec.js
- tests/acceptance/story-1-5-topic-intro-voice.acceptance.spec.js
- tests/acceptance/story-1-6-screen1-refactor.acceptance.spec.js
- tests/acceptance/story-1-7-hero-selection.acceptance.spec.js
- tests/acceptance/story-2-1-challenge-question-count-formula.acceptance.spec.js
- tests/acceptance/story-2-2-diverse-question-selection-with-cooldown.acceptance.spec.js
- tests/acceptance/story-2-3-guided-feedback-and-explanation-states.acceptance.spec.js
- tests/acceptance/story-2-5-performance-indicators-and-answer-micro-interactions.acceptance.spec.js
- tests/acceptance/story-3-1-xp-and-pass-threshold-calculation.acceptance.spec.js
- tests/acceptance/story-3-2-two-attempt-guided-retry-and-assisted-resolution.acceptance.spec.js
- tests/acceptance/story-3-3-continue-flow-after-correct-or-assisted-acknowledge.acceptance.spec.js
- tests/acceptance/story-3-4-streak-and-persistence-bonus-awards.acceptance.spec.js
- tests/acceptance/story-3-5-challenge-hero-voice-narration.acceptance.spec.js
- tests/integration/story-1-1-onboarding-validation.integration.test.jsx
- tests/integration/story-1-2-profile-persistence.integration.test.jsx
- tests/integration/story-1-3-returning-state.integration.test.jsx
- tests/integration/story-1-6-screen1-refactor.integration.test.jsx
- tests/integration/story-1-7-hero-selection.integration.test.jsx
- tests/unit/story-1-2-profile-persistence.unit.test.jsx
- tests/unit/story-1-3-returning-state.unit.test.jsx
- _bmad-output/implementation-artifacts/sprint-status.yaml

### Change Log
- 2026-03-12: Implemented Story 1.8 route split and player-select home.
- 2026-03-12: Added profile-directory storage support and Story 1.8 automated test coverage.
- 2026-03-12: Updated sprint status and context docs to reflect implemented behavior.
