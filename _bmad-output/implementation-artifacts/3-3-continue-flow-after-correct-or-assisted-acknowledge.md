# Story 3.3: Continue Flow After Correct or Assisted Acknowledge

Status: done

## Story

As a learner,
I want to continue only after success or explicit acknowledgment confirmation,
so that I complete each question with closure.

## Acceptance Criteria

1. Primary action label is always `Next` in all states.
2. `Next` is disabled until question is resolved via correct answer or assisted acknowledgment.
3. `Next` advances only after assisted explanation is visible.
4. Next-question transition resets per-question transient state cleanly (selected answer, attempt stage, hero/pet message context).
5. Last-question behavior routes to level-complete summary without off-by-one errors in progress text or bar.
6. Integration/acceptance tests validate button labels, enablement, and transition behavior across states.

## Tasks / Subtasks

- [x] Implement primary action state mapping (AC: 1, 2, 3)
  - [x] Map challenge state to action label and enabled state
  - [x] Prevent premature continuation
- [x] Implement question-to-question reset behavior (AC: 4)
  - [x] Reset ephemeral state only
  - [x] Preserve session-level outcome history and XP aggregates
- [x] Validate end-of-level transition semantics (AC: 5)
  - [x] Confirm last-question routing and progress display consistency
- [x] Add automated validation coverage (AC: 6)
  - [x] Integration tests for label/enable transitions
  - [x] Acceptance flow checks through assisted acknowledgment

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
- `npm run dev-story:validate`
- `npm run test:integration`
- `npm run test:acceptance`

### Completion Notes List
- Implemented declarative primary-action mapping in `app/challenge/page.js`:
  - `Next` in guided retry, resolved, and assisted acknowledgment states
- Enforced disabled `Next` before resolution and during assisted acknowledgment until explanation becomes visible.
- Implemented clean transient-state reset on question advance while preserving session-level outcome and XP history.
- Implemented last-question routing to summary with correct `N/N` and full progress bar fill semantics.
- Updated existing Story 2.2 integration test to use new `challenge-primary-action` behavior.
- Manual Test Steps (executed): validate label transitions across wrong/retry/assisted flows, verify `Next` disabled pre-resolution, verify `Next` gate after assisted reveal delay, verify final question routes to summary and progress displays `9/9`.
- Manual Validation Result: PASS.
- Automated Validation Result: PASS (`build`, unit, integration, acceptance).

### File List
- app/challenge/page.js
- tests/unit/story-3-3-continue-flow-after-correct-or-assisted-acknowledge.unit.test.js
- tests/integration/story-2-2-diverse-question-selection-with-cooldown.integration.test.jsx
- tests/integration/story-3-3-continue-flow-after-correct-or-assisted-acknowledge.integration.test.jsx
- tests/acceptance/story-3-3-continue-flow-after-correct-or-assisted-acknowledge.acceptance.spec.js
- _bmad-output/implementation-artifacts/3-3-continue-flow-after-correct-or-assisted-acknowledge.md
- _bmad-output/implementation-artifacts/sprint-status.yaml

### Change Log
- 2026-03-05: Story created as implementation-ready (`ready-for-dev`).
- 2026-03-05: Implemented state-based continuation controls and end-of-level transition semantics; status moved to `review`.
- 2026-03-06: Added targeted unit coverage for `Next` label consistency and enablement gating rules in the primary action state model.
- 2026-03-06: Updated acceptance criteria and notes to reflect single-label primary action UX (`Next`).
