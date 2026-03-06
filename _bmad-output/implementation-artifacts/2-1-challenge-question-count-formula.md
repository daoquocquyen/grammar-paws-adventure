# Story 2.1: Challenge Question Count Formula

Status: done

## Story

As the system,
I want challenge question count to use clamp(aspect_count * 3, 6, 15),
so that each challenge has age-appropriate length.

## Acceptance Criteria

1. Given `aspect_count = 4`, `question_count` resolves to `12`.
2. Given `aspect_count = 1`, `question_count` resolves to minimum cap `6`.
3. Given `aspect_count = 8`, `question_count` resolves to maximum cap `15`.
4. Formula logic is centralized in shared challenge rule utility (no duplicated literals in route components).
5. Unit tests cover nominal and boundary values for the formula.
6. Integration test verifies question-count metadata is surfaced in active topic-intro challenge-prep UI.
7. Acceptance test verifies question-count metadata is visible in browser flow for a selected topic.
8. `npm run build` and `npm run test:unit` pass.

## Tasks / Subtasks

- [x] Implement centralized challenge question-count rule utility (AC: 1, 2, 3, 4)
  - [x] Add constants for multiplier/min/max in a dedicated challenge rule module
  - [x] Add exported function that computes `question_count` from `aspect_count`
  - [x] Add safe integer handling for non-integer/invalid aspect counts
- [x] Apply utility in active challenge-prep surface (AC: 4)
  - [x] Use utility where topic aspect data is prepared for challenge flow
  - [x] Ensure no hardcoded question-count literals are introduced in page components
- [x] Add automated validation coverage (AC: 5, 6, 7)
  - [x] Add unit tests for `{1,4,8}` and additional edge inputs
  - [x] Add integration test for topic-intro challenge metadata wiring
  - [x] Add acceptance test for browser-visible challenge metadata
- [x] Validate implementation (AC: 8)
  - [x] Run `npm run build`
  - [x] Run `npm run test:unit`
  - [x] Run Story 2.1 integration test
  - [x] Run Story 2.1 acceptance test

## Dev Notes

### Scope Guardrails
- Story 2.1 is formula/rule wiring only; question diversity, explanations, and voice replay are out of scope (covered by Stories 2.2–2.4).
- Keep existing route structure and visual design intact; no extra screens/features.

### Architecture and Coding Requirements
- Follow `docs/coding-standards.md`: centralize gameplay constants; avoid duplicated literals.
- Keep logic in reusable lib module under `src/lib/` so upcoming challenge stories can reuse it.
- Preserve current local-first architecture and existing storage keys.

### Source Intelligence
- Formula source: `_bmad-output/planning-artifacts/functional-requirements-mvp.md` (SR-03, AC-02).
- Slice mapping: `_bmad-output/planning-artifacts/implementation-slices-feature-and-screen-plan.md` (Slice 2).
- Testing expectations: `docs/testing-strategy.md` (run build + unit + integration + acceptance unless explicit user-approved deferral).

### Project Structure Notes
- Current challenge shell is legacy in `src/ui/stitch/screen4-game-challenge.html`.
- Active React routes for this story are `app/topic-intro/page.js` and `app/challenge/page.js`.
- Legacy `/screen3-grammar-topic-intro` and `/screen4-game-challenge` paths are handled via config redirects.

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
- `npm run dev-story:validate` (pass: build + unit)
- `npx vitest run tests/integration/story-2-1-challenge-question-count-formula.integration.test.jsx` (pass)
- `npx playwright test tests/acceptance/story-2-1-challenge-question-count-formula.acceptance.spec.js` (pass)

### Completion Notes List
- Implemented `src/lib/challengeQuestionCount.js` with centralized constants and deterministic clamp logic: `clamp(aspect_count * 3, 6, 15)`.
- Added safe handling for invalid/decimal/negative aspect counts before formula application.
- Wired shared formula utility into active topic intro challenge-prep routes (`/topic-intro` and legacy compatibility `/screen3-grammar-topic-intro`) via `useMemo` and challenge metadata attributes.
- Kept CTA label as plain `Start Challenge` (no visible question count) while preserving computed `data-question-count` metadata for deterministic rule validation.
- Updated Start Challenge primary CTA to navigate to `/challenge` and added compatibility redirect from `/screen4-game-challenge` to `/challenge`.
- Added Story 2.1 unit tests with AC-targeted inputs (`1`, `4`, `8`) and edge coverage.
- Added Story 2.1 integration test to verify Start Challenge metadata exposes computed question count from selected topic aspect count.
- Added Story 2.1 acceptance test to verify Start Challenge metadata plus click navigation to `/challenge` for selected topic flow.
- Manual verification checklist for this story:
  - [ ] Open `/topic-intro` with any valid selected topic and inspect Start Challenge element metadata.
  - [ ] Confirm `data-question-count` equals clamped value derived from topic aspect count.
  - [ ] Confirm CTA text remains `Start Challenge` (no visible question count).
  - [ ] Click Start Challenge and confirm route transition to `/challenge`.
  - [ ] Confirm no visual regression on topic intro CTA row.
- Manual checks not executed in this non-interactive session.

### File List
- _bmad-output/implementation-artifacts/2-1-challenge-question-count-formula.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- src/lib/challengeQuestionCount.js
- app/topic-intro/page.js
- app/challenge/page.js
- tests/unit/story-2-1-challenge-question-count-formula.unit.test.js
- tests/integration/story-2-1-challenge-question-count-formula.integration.test.jsx
- tests/acceptance/story-2-1-challenge-question-count-formula.acceptance.spec.js

### Change Log
- 2026-03-05: Story created from Epic 2 backlog with comprehensive implementation context.
- 2026-03-05: Implemented shared challenge question count utility and applied it to topic intro challenge-prep routes.
- 2026-03-05: Added unit coverage for formula AC scenarios and edge handling; validated with `npm run dev-story:validate`.
- 2026-03-05: Added Story 2.1 integration and acceptance tests for challenge question-count metadata rendering and validated both tests pass.
- 2026-03-05: Aligned CTA UX to plain `Start Challenge` (no visible count) and added functional navigation to `/challenge` with legacy route compatibility redirect.
- 2026-03-06: Senior review pass confirmed AC coverage and no further implementation defects.
