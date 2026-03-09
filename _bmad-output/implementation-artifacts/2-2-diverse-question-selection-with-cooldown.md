# Story 2.2: Diverse Question Selection with Cooldown

Status: done

## Story

As a learner,
I want varied questions across attempts,
so that retries feel fresh and useful.

## Acceptance Criteria

1. Challenge question selection prioritizes coverage across multiple aspects before repeating the same aspect.
2. Question selection excludes question IDs from the last `N=2` topic attempts when enough pool exists.
3. If cooldown exclusion cannot fill the target question count, selector gracefully falls back to remaining questions without duplicates.
4. Selection logic is centralized in a reusable challenge utility module (no duplicated route-level rule logic).
5. Unit tests cover diversity behavior, cooldown exclusion, and fallback behavior.
6. Integration test verifies challenge page applies cooldown-aware selection for selected topic history from localStorage.
7. Acceptance test verifies consecutive retries produce a different question set for the same topic when pool is not exhausted.
8. `npm run build`, `npm run test:unit`, Story 2.2 integration test, and Story 2.2 acceptance test pass.

## Tasks / Subtasks

- [x] Implement centralized diverse selection + cooldown utility (AC: 1, 2, 3, 4)
  - [x] Add reusable selector that round-robins by aspect to maximize coverage
  - [x] Add recent-attempt cooldown extraction with default `N=2`
  - [x] Add fallback path when exclusion cannot satisfy question count
- [x] Wire challenge route to use shared utility (AC: 1, 2, 3, 4, 6)
  - [x] Read selected topic + recent attempt history from localStorage
  - [x] Build deterministic topic question bank fixture per aspect for MVP challenge prep
  - [x] Persist generated attempt history for retry variation
- [x] Add automated validation coverage (AC: 5, 6, 7)
  - [x] Add Story 2.2 unit tests for aspect diversity, cooldown exclusion, and fallback reuse
  - [x] Add Story 2.2 integration test for challenge metadata with cooldown history
  - [x] Add Story 2.2 acceptance test for varied consecutive retry question sets
- [x] Validate implementation (AC: 8)
  - [x] Run `npm run build`
  - [x] Run `npm run test:unit`
  - [x] Run Story 2.2 integration test
  - [x] Run Story 2.2 acceptance test

## Dev Notes

### Scope Guardrails
- Story 2.2 covers question selection diversity + cooldown only.
- Immediate answer correctness/explanations and voice replay behavior remain in Stories 2.3 and 2.4.

### Architecture and Coding Requirements
- Keep gameplay rule logic centralized in `src/lib/`.
- Preserve local-first persistence model with versioned storage keys.
- Avoid introducing route-level duplicated selection constants.

### Source Intelligence
- Functional requirements source: `_bmad-output/planning-artifacts/functional-requirements-mvp.md` (SR-03, AC-05).
- Slice mapping source: `_bmad-output/planning-artifacts/implementation-slices-feature-and-screen-plan.md` (Slice 2).
- Test execution policy: `docs/testing-strategy.md`.

### Project Structure Notes
- Active challenge route for this story: `app/challenge/page.js`.
- Story 2.1 question-count rule utility already exists in `src/lib/challengeQuestionCount.js` and should be reused by selector.

### References
- `docs/project-context.md`
- `docs/architecture.md`
- `docs/coding-standards.md`
- `docs/testing-strategy.md`
- `_bmad-output/planning-artifacts/functional-requirements-mvp.md`
- `_bmad-output/planning-artifacts/implementation-slices-feature-and-screen-plan.md`

## Dev Agent Record

### Agent Model Used
GPT-5.3-Codex

### Debug Log References
- `npm run build` (pass)
- `npm run test:unit` (pass)
- `npx vitest run tests/integration/story-2-2-diverse-question-selection-with-cooldown.integration.test.jsx` (pass)
- `npx playwright test tests/acceptance/story-2-2-diverse-question-selection-with-cooldown.acceptance.spec.js` (pass)

### Completion Notes List
- Added `src/lib/challengeQuestionSelection.js` with centralized cooldown-aware diverse question selection.
- Implemented round-robin-by-aspect selection to maximize aspect variety before repeats.
- Added recent-attempt exclusion (`N=2` by default) and fallback selection when pool is insufficient.
- Added in-challenge stem-level dedupe guard so one challenge run does not repeat equivalent question stems.
- Wired `app/challenge/page.js` to load selected topic/history from localStorage, prepare challenge question IDs, and persist attempt history for retries.
- Added Story 2.2 unit/integration/acceptance tests for variety, cooldown exclusion, fallback behavior, and in-challenge stem uniqueness.
- Manual test steps for this story:
  - [ ] Set `gpa_selected_topic_v1` to any supported topic key in browser localStorage.
  - [ ] Open `/challenge` and verify metadata shows 9 generated question IDs.
  - [ ] Reload `/challenge` and verify generated question ID set changes from previous attempt.
  - [ ] Preload `gpa_topic_attempt_history_v1` with recent attempts and verify recent IDs are excluded when possible.
  - [ ] Verify no crash occurs if attempt history key is missing/corrupt.
- Manual checks not executed in this non-interactive session.

### File List
- _bmad-output/implementation-artifacts/2-2-diverse-question-selection-with-cooldown.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- src/lib/challengeQuestionSelection.js
- app/challenge/page.js
- tests/unit/story-2-2-diverse-question-selection-with-cooldown.unit.test.js
- tests/integration/story-2-2-diverse-question-selection-with-cooldown.integration.test.jsx
- tests/acceptance/story-2-2-diverse-question-selection-with-cooldown.acceptance.spec.js

### Change Log
- 2026-03-05: Story created from Epic 2 backlog with comprehensive implementation context.
- 2026-03-05: Implemented centralized diverse question selection utility with recent-attempt cooldown and fallback behavior.
- 2026-03-05: Wired challenge route to produce and persist cooldown-aware topic attempt question sets.
- 2026-03-05: Added Story 2.2 unit, integration, and acceptance tests.
- 2026-03-06: Fixed topic-hydration race in challenge attempt persistence and added integration coverage to prevent cross-topic history pollution.
- 2026-03-09: Enforced no-duplicate stems within each challenge selection, expanded Story 2.2 unit coverage, and exposed stem uniqueness metadata for integration assertions.
