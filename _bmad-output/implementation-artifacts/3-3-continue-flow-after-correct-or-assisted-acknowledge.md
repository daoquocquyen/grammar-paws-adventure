# Story 3.3: Continue Flow After Correct or Assisted Acknowledge

Status: ready-for-dev

## Story

As a learner,
I want to continue only after success or "I understand" confirmation,
so that I complete each question with closure.

## Acceptance Criteria

1. Primary action label is state-based:
   - `Try Again` during guided retry
   - `Continue` after first/second correct outcomes
   - `I understand` during assisted acknowledgment state
2. `Continue` is disabled until question is resolved via correct answer or assisted acknowledgment.
3. `I understand` advances only after assisted explanation is visible.
4. Next-question transition resets per-question transient state cleanly (selected answer, attempt stage, hero/pet message context).
5. Last-question behavior routes to level-complete summary without off-by-one errors in progress text or bar.
6. Integration/acceptance tests validate button labels, enablement, and transition behavior across states.

## Tasks / Subtasks

- [ ] Implement primary action state mapping (AC: 1, 2, 3)
  - [ ] Map challenge state to action label and enabled state
  - [ ] Prevent premature continuation
- [ ] Implement question-to-question reset behavior (AC: 4)
  - [ ] Reset ephemeral state only
  - [ ] Preserve session-level outcome history and XP aggregates
- [ ] Validate end-of-level transition semantics (AC: 5)
  - [ ] Confirm last-question routing and progress display consistency
- [ ] Add automated validation coverage (AC: 6)
  - [ ] Integration tests for label/enable transitions
  - [ ] Acceptance flow checks through assisted acknowledgment

## Dev Notes

### Scope Guardrails
- Story focuses on progression controls and closure states.
- Does not define scoring formulas (Story 3.1/3.4).

### Architecture and Coding Requirements
- Keep button-state logic declarative from state machine status.
- Avoid duplicate continuation logic in multiple handlers.

### Source Intelligence
- Epic source: `_bmad-output/planning-artifacts/epics-mvp-grammar-paws-adventure.md` (Story 3.3).
- PRD source: `_bmad-output/planning-artifacts/prd-mvp-grammar-paws-adventure.md` (FR-04).
- UX source: `docs/ui-ux-design.md` (CTA hierarchy and state handling).

### References
- `docs/project-context.md`
- `docs/architecture.md`
- `docs/ui-ux-design.md`
- `_bmad-output/planning-artifacts/prd-mvp-grammar-paws-adventure.md`

## Dev Agent Record

### Agent Model Used
GPT-5 Codex

### Debug Log References
- N/A (story creation only)

### Completion Notes List
- Story created for deterministic progression and state-based primary action behavior.

### File List
- _bmad-output/implementation-artifacts/3-3-continue-flow-after-correct-or-assisted-acknowledge.md

### Change Log
- 2026-03-05: Story created as implementation-ready (`ready-for-dev`).
