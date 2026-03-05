# Story 2.5: Performance Indicators and Answer Micro-Interactions

Status: ready-for-dev

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

- [ ] Implement indicator rendering and mapping (AC: 1, 2)
  - [ ] Add indicator-state model tied to per-question outcome class
  - [ ] Render `⭐/☆/✓` summary row near progress zone
  - [ ] Remove punitive copy/icon paths from challenge UI
- [ ] Implement micro-interaction states (AC: 3, 4, 5, 7)
  - [ ] Selected answer highlight + subtle scale
  - [ ] Incorrect answer shake + disable for retry
  - [ ] Correct answer soft glow state
- [ ] Validate progress bar visual semantics (AC: 6)
  - [ ] Keep `1/N` with empty fill on first question
  - [ ] Ensure last question reaches full fill
- [ ] Add automated validation coverage (AC: 8)
  - [ ] Unit tests for indicator mapping by outcome type
  - [ ] Integration tests for class/state transitions on select/wrong/correct
  - [ ] Acceptance checks for indicator visibility and non-punitive UI constraints

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
- N/A (story creation only)

### Completion Notes List
- Story created from approved correct-course proposal and mapped to current challenge implementation direction.

### File List
- _bmad-output/implementation-artifacts/2-5-performance-indicators-and-answer-micro-interactions.md

### Change Log
- 2026-03-05: Story created as implementation-ready (`ready-for-dev`).
