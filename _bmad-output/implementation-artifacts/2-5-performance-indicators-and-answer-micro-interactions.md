# Story 2.5: Performance Indicators and Answer Micro-Interactions

Status: review

## Story

As a learner,
I want clear positive indicators and gentle motion feedback,
so that I can track learning quality without feeling punished.

## Acceptance Criteria

1. Challenge top bar displays per-question quality indicators using only:
   - `⭐` = first-try correct
   - `☆` = second-try correct
   - `✓` = assisted learning
2. UI must never show punitive labels/icons (no `Wrong`, red cross, or fail counter chip).
3. Selected answer shows soft highlight and subtle scale animation.
4. Incorrect answer interaction shows light shake and disables that specific option in guided retry.
5. Correct answer shows soft glow feedback on selected option.
6. Progress bar has visible glow and remains consistent with progress semantics:
   - Question 1 shows `1/N` while bar fill is empty.
   - Last question shows `N/N` and bar fill is full.
7. Interaction motion remains gentle and child-friendly (no aggressive bounce/shake loops).
8. Unit/integration/acceptance tests verify indicator mapping and key interaction-state styles/classes.

## Tasks / Subtasks

- [x] Implement indicator rendering and mapping (AC: 1, 2)
  - [x] Add indicator-state model tied to per-question outcome class
  - [x] Render `⭐/☆/✓` summary row near progress zone
  - [x] Remove punitive copy/icon paths from challenge UI
- [x] Implement micro-interaction states (AC: 3, 4, 5, 7)
  - [x] Selected answer highlight + subtle scale
  - [x] Incorrect answer shake + disable for retry
  - [x] Correct answer soft glow state
- [x] Validate progress bar visual semantics (AC: 6)
  - [x] Keep `1/N` with empty fill on first question
  - [x] Ensure last question reaches full fill
- [x] Add automated validation coverage (AC: 8)
  - [x] Unit tests for indicator mapping by outcome type
  - [x] Integration tests for class/state transitions on select/wrong/correct
  - [x] Acceptance checks for indicator visibility and non-punitive UI constraints

## Dev Notes

### Scope Guardrails
- This story is visual and interaction-state focused.
- Retry stage flow and explanation orchestration remain in Story 2.3 and 3.2.
- XP and streak/persistence math remain in Stories 3.1 and 3.4.

### Architecture and Coding Requirements
- Keep indicator source-of-truth in challenge state, not inferred from DOM.
- Avoid style-only logic that cannot be asserted in tests.
- Preserve accessibility semantics for disabled answer options.

### Source Intelligence
- Epic source: `_bmad-output/planning-artifacts/epics-mvp-grammar-paws-adventure.md` (Story 2.5).
- PRD source: `_bmad-output/planning-artifacts/prd-mvp-grammar-paws-adventure.md` (FR-03/FR-07).
- UX source: `docs/ui-ux-design.md` (Screen 4).
- Change proposal: `_bmad-output/planning-artifacts/sprint-change-proposal-2026-03-05.md`.

### Project Structure Notes
- Challenge route: `app/challenge/page.js`.
- Shared challenge utilities: `src/lib/challengeQuestionSelection.js` and related helpers.
- Tests: `tests/unit`, `tests/integration`, `tests/acceptance` with story-specific naming.

### References
- `docs/project-context.md`
- `docs/ui-ux-design.md`
- `docs/architecture.md`
- `_bmad-output/planning-artifacts/prd-mvp-grammar-paws-adventure.md`
- `_bmad-output/planning-artifacts/epics-mvp-grammar-paws-adventure.md`

## Dev Agent Record

### Agent Model Used
GPT-5 Codex

### Debug Log References
- `npm run dev-story:validate`
- `npm run test:integration`
- `npm run test:acceptance`

### Completion Notes List
- Added per-question indicator rendering in `app/challenge/page.js` backed by outcome source-of-truth and `src/lib/challengeStateModel.js` mapping (`⭐`, `☆`, `✓`).
- Removed punitive UI labels and replaced phase badge text with non-punitive labels (`Ready`, `Guided Retry`, `Great Work`, `Coach Help`).
- Implemented answer micro-interaction classes (`gpa-answer-selected`, `gpa-answer-shake`, `gpa-answer-correct-glow`) and added CSS animations in `app/globals.css`.
- Implemented guided-retry disabled-option behavior and preserved progress semantics (`1/N` with empty fill at first question, full fill on last question).
- Manual Test Steps (executed): trigger first wrong answer, verify wrong-state feedback and `Try Again`, verify wrong option disabled on retry, select correct retry answer, verify indicator row updates to `☆`, confirm no `Wrong`/punitive labels in challenge UI.
- Manual Validation Result: PASS.
- Automated Validation Result: PASS (`build`, unit, integration, acceptance).

### File List
- app/challenge/page.js
- app/globals.css
- src/lib/challengeStateModel.js
- tests/unit/story-2-5-performance-indicators-and-answer-micro-interactions.unit.test.js
- tests/integration/story-2-5-performance-indicators-and-answer-micro-interactions.integration.test.jsx
- tests/acceptance/story-2-5-performance-indicators-and-answer-micro-interactions.acceptance.spec.js
- _bmad-output/implementation-artifacts/2-5-performance-indicators-and-answer-micro-interactions.md
- _bmad-output/implementation-artifacts/sprint-status.yaml

### Change Log
- 2026-03-05: Story created as implementation-ready (`ready-for-dev`).
- 2026-03-05: Implemented indicator model and child-friendly answer micro-interactions with full test coverage; status moved to `review`.
