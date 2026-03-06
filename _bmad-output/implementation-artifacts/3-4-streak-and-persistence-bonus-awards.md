# Story 3.4: Streak and Persistence Bonus Awards

Status: review

## Story

As a learner,
I want streak and persistence bonuses,
so that consistent effort and correction are both rewarded.

## Acceptance Criteria

1. First-try streak tracking awards:
   - 3 in a row => +5 XP
   - 5 in a row => +10 XP
2. End-of-level first-try accuracy bonus awards +20 XP when first-try accuracy is 70% or higher.
3. End-of-level persistence bonus awards +10 XP when learner corrected 3 or more mistakes.
4. Bonus calculations are deterministic and based on recorded per-question outcome classes.
5. Bonus XP appears in end-of-level summary with supportive messaging.
6. Bonus awards are applied once and cannot duplicate on repeated summary interactions.
7. Unit tests validate streak and end-of-level bonus calculations.
8. Integration tests validate summary rendering and one-time bonus application.

## Tasks / Subtasks

- [x] Implement streak bonus calculator (AC: 1, 4, 7)
  - [x] Track consecutive first-try-correct streak windows
  - [x] Award configured streak XP thresholds
- [x] Implement end-of-level bonus calculator (AC: 2, 3, 4, 7)
  - [x] Compute first-try accuracy percentage
  - [x] Compute corrected-mistake count
- [x] Wire bonus display and award-once guard (AC: 5, 6, 8)
  - [x] Render bonus breakdown in summary
  - [x] Prevent duplicate applications from repeated clicks/renders
- [x] Add automated validation coverage (AC: 7, 8)
  - [x] Unit tests for all bonus branches and edge cases
  - [x] Integration tests for summary display and idempotent apply behavior

## Dev Notes

### Scope Guardrails
- Base XP mapping is handled in Story 3.1.
- Retry stage behavior is handled in Story 3.2.

### Architecture and Coding Requirements
- Bonus logic should consume canonical outcome history from challenge session model.
- Keep calculators pure and testable.

### Source Intelligence
- Epic source: `_bmad-output/planning-artifacts/epics-mvp-grammar-paws-adventure.md` (Story 3.4).
- PRD source: `_bmad-output/planning-artifacts/prd-mvp-grammar-paws-adventure.md` (FR-06 bonus rules).
- Change proposal source: `_bmad-output/planning-artifacts/sprint-change-proposal-2026-03-05.md`.

### References
- `docs/project-context.md`
- `docs/architecture.md`
- `docs/testing-strategy.md`
- `_bmad-output/planning-artifacts/prd-mvp-grammar-paws-adventure.md`

## Dev Agent Record

### Agent Model Used
GPT-5 Codex

### Debug Log References
- `npm run dev-story:validate`
- `npm run test:integration`
- `npm run test:acceptance`

### Completion Notes List
- Implemented streak and end-of-level bonus calculators in `src/lib/challengeScoring.js`:
  - streak awards: +5 at 3 first-try chain, +10 at 5 first-try chain
  - first-try accuracy bonus: +20 at `>=70%`
  - persistence bonus: +10 at 3+ corrected mistakes
- Wired summary bonus breakdown rendering and total XP aggregation in `app/challenge/page.js`.
- Added persistence idempotency guard (`summaryPersisted`) so summary awards are saved once per run.
- Added acceptance/integration coverage for bonus rendering and idempotent persistence behavior.
- Manual Test Steps (executed): complete full challenge first-try, verify summary shows streak/accuracy/persistence lines, verify bonus XP (`35`) and total XP (`125`), verify rerender does not duplicate persisted total XP.
- Manual Validation Result: PASS.
- Automated Validation Result: PASS (`build`, unit, integration, acceptance).

### File List
- app/challenge/page.js
- src/lib/challengeScoring.js
- tests/unit/story-3-4-streak-and-persistence-bonus-awards.unit.test.js
- tests/integration/story-3-4-streak-and-persistence-bonus-awards.integration.test.jsx
- tests/acceptance/story-3-4-streak-and-persistence-bonus-awards.acceptance.spec.js
- _bmad-output/implementation-artifacts/3-4-streak-and-persistence-bonus-awards.md
- _bmad-output/implementation-artifacts/sprint-status.yaml

### Change Log
- 2026-03-05: Story created as implementation-ready (`ready-for-dev`).
- 2026-03-05: Implemented streak/persistence/accuracy bonuses with one-time persistence and test coverage; status moved to `review`.
