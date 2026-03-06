# Story 3.2: Two-Attempt Guided Retry and Assisted Resolution

Status: review

## Story

As a learner,
I want a limited retry flow with guided support and assisted resolution,
so that I can recover from mistakes without frustration loops.

## Acceptance Criteria

1. Each question supports max 2 independent answer attempts.
2. First incorrect attempt transitions to guided retry state with the previously chosen incorrect option disabled.
3. Guided retry hero message explains concept without revealing the correct answer.
4. Second incorrect attempt transitions to assisted state with step-by-step explanation and correct-answer reveal.
5. Assisted state requires explicit learner acknowledgment (`I understand`) before progressing.
6. Unlimited retries are not possible in any state.
7. Transition sequence follows state order and cannot skip mandatory intermediate states.
8. Unit and integration tests validate state transitions and disabled-option behavior.

## Tasks / Subtasks

- [x] Implement attempt counter and finite flow controls (AC: 1, 6, 7)
  - [x] Enforce max two attempts
  - [x] Block further independent selections after second incorrect attempt
- [x] Implement guided retry behavior (AC: 2, 3)
  - [x] Disable previously incorrect option for retry stage
  - [x] Render non-revealing guided explanation
- [x] Implement assisted resolution behavior (AC: 4, 5)
  - [x] Reveal correct answer with calm step-by-step explanation
  - [x] Gate progression behind `I understand`
- [x] Add automated validation coverage (AC: 8)
  - [x] Unit tests for transition graph
  - [x] Integration tests for retry disable/reveal/gate behavior

## Dev Notes

### Scope Guardrails
- XP math is handled in Story 3.1 and Story 3.4.
- Indicator rendering is handled in Story 2.5.

### Architecture and Coding Requirements
- Follow challenge runtime state model in `docs/architecture.md`.
- Keep stage transitions deterministic and traceable for testing.

### Source Intelligence
- Epic source: `_bmad-output/planning-artifacts/epics-mvp-grammar-paws-adventure.md` (Story 3.2).
- PRD source: `_bmad-output/planning-artifacts/prd-mvp-grammar-paws-adventure.md` (FR-03/FR-04).
- UX source: `docs/ui-ux-design.md` (Screen 4 state handling).

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
- Implemented finite two-attempt flow in `app/challenge/page.js` with deterministic transitions and no third independent attempt path.
- Enforced guided-retry behavior by disabling first wrong option and requiring explicit `Try Again` before retry selection.
- Implemented assisted resolution state with delayed reveal and progression gate via `I understand`.
- Updated question generation in `src/lib/challengeQuestionSelection.js` to provide 4 options per question, preserving assisted-path coverage after one wrong option is disabled.
- Manual Test Steps (executed): choose wrong option, verify `Try Again`, click `Try Again`, verify wrong option disabled, choose second wrong option, verify `I understand` appears after delay and options become non-selectable.
- Manual Validation Result: PASS.
- Automated Validation Result: PASS (`build`, unit, integration, acceptance).

### File List
- app/challenge/page.js
- src/lib/challengeStateModel.js
- src/lib/challengeQuestionSelection.js
- tests/unit/story-3-2-two-attempt-guided-retry-and-assisted-resolution.unit.test.js
- tests/integration/story-3-2-two-attempt-guided-retry-and-assisted-resolution.integration.test.jsx
- _bmad-output/implementation-artifacts/3-2-two-attempt-guided-retry-and-assisted-resolution.md
- _bmad-output/implementation-artifacts/sprint-status.yaml

### Change Log
- 2026-03-05: Story created as implementation-ready (`ready-for-dev`).
- 2026-03-05: Implemented finite retry and assisted-resolution gating with deterministic transitions and coverage; status moved to `review`.
- 2026-03-06: Updated challenge option count documentation to reflect 4 options per question.
