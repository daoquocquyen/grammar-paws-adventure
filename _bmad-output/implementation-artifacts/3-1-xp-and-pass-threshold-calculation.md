# Story 3.1: XP and Pass Threshold Calculation

Status: ready-for-dev

## Story

As the system,
I want pass/fail and XP computed from attempt quality,
so that progression rewards learning effort and correctness.

## Acceptance Criteria

1. Base XP per question is computed exactly:
   - first-try correct = 10 XP
   - second-try correct = 6 XP
   - assisted resolution = 3 XP
   - skip = 0 XP
2. Challenge score tracks total correct outcomes and pass/fail remains `>=80%`.
3. Question outcome class is persisted for each answered question (`first_try_correct`, `second_try_correct`, `assisted`, `skipped`).
4. Per-question XP award is emitted once per question and cannot be double-awarded by repeated clicks.
5. XP award messaging is supportive and concise (e.g., `+10 XP! Amazing focus!`, `+6 XP! You fixed it!`, `+3 XP! Learning moment!`).
6. Level-complete summary includes total XP gained and pass/fail result derived from the same source-of-truth model.
7. Unit tests validate XP and pass-threshold calculations for mixed outcome sets.
8. Integration tests validate award-once behavior and summary values.

## Tasks / Subtasks

- [ ] Implement XP calculation utility (AC: 1, 7)
  - [ ] Add deterministic mapping from outcome class to base XP
  - [ ] Add aggregate score + pass-threshold helper
- [ ] Wire per-question award flow (AC: 3, 4, 5)
  - [ ] Persist outcome class in challenge session state
  - [ ] Guard against duplicate awards
  - [ ] Render outcome-aligned XP message
- [ ] Implement level-complete summary fields (AC: 2, 6)
  - [ ] Show total XP and pass/fail from computed aggregates
- [ ] Add automated validation coverage (AC: 7, 8)
  - [ ] Unit tests for XP mapping and pass-threshold edge cases
  - [ ] Integration tests for one-time award and summary correctness

## Dev Notes

### Scope Guardrails
- Streak and persistence bonuses are covered in Story 3.4.
- Guided retry transition rules remain in Story 3.2.

### Architecture and Coding Requirements
- Keep scoring logic in reusable `src/lib` utilities.
- Use one canonical challenge-session model for UI and persistence calculations.

### Source Intelligence
- Epic source: `_bmad-output/planning-artifacts/epics-mvp-grammar-paws-adventure.md` (Story 3.1).
- PRD source: `_bmad-output/planning-artifacts/prd-mvp-grammar-paws-adventure.md` (FR-04/FR-06).
- Architecture source: `docs/architecture.md` (Challenge runtime state model).

### References
- `docs/project-context.md`
- `docs/architecture.md`
- `docs/testing-strategy.md`
- `_bmad-output/planning-artifacts/prd-mvp-grammar-paws-adventure.md`

## Dev Agent Record

### Agent Model Used
GPT-5 Codex

### Debug Log References
- N/A (story creation only)

### Completion Notes List
- Story created with explicit XP and pass-threshold contracts for implementation and tests.

### File List
- _bmad-output/implementation-artifacts/3-1-xp-and-pass-threshold-calculation.md

### Change Log
- 2026-03-05: Story created as implementation-ready (`ready-for-dev`).
