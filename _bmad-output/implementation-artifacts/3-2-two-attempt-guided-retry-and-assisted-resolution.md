# Story 3.2: Two-Attempt Guided Retry and Assisted Resolution

Status: done

## Story

As a learner,
I want a limited retry flow with guided support and assisted resolution,
so that I can recover from mistakes without frustration loops.

## Acceptance Criteria

1. Each question supports max 2 independent answer attempts.
2. First incorrect attempt transitions to guided retry state with the previously chosen incorrect option disabled.
3. Guided retry hero message explains concept without revealing the correct answer.
4. Second incorrect attempt transitions to coached assisted state with step-by-step explanation and no automatic completion.
5. If learner answers correctly during coached assisted state, explicit learner acknowledgment (`Next`) is required before progressing.
6. If learner answers incorrectly during coached assisted state, question is marked failed (`skipped`, no XP) and automatically advances to next question.
7. Unlimited retries are not possible in any state.
8. Transition sequence follows state order and cannot skip mandatory intermediate states.
9. Unit and integration tests validate state transitions and disabled-option behavior.

## Tasks / Subtasks

- [x] Implement attempt counter and finite flow controls (AC: 1, 7, 8)
  - [x] Enforce max two attempts
  - [x] Block unlimited retry loops
- [x] Implement guided retry behavior (AC: 2, 3)
  - [x] Disable previously incorrect option for retry stage
  - [x] Render non-revealing guided explanation
- [x] Implement assisted/coached resolution behavior (AC: 4, 5, 6)
  - [x] Keep second wrong as coached stage (no auto complete/XP)
  - [x] Gate progression behind `Next` only after coached correct
  - [x] Mark coached wrong as `skipped` and auto-advance
- [x] Add automated validation coverage (AC: 9)
  - [x] Unit tests for transition graph
  - [x] Integration tests for retry disable/coached-skip/ack behavior

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
- Enforced guided-retry behavior by disabling the first wrong option while keeping remaining options available for retry.
- Implemented coached assisted behavior where second wrong does not auto-complete or auto-award XP.
- Implemented assisted acknowledgment gate (`Next`) only after a coached correct answer.
- Implemented coached wrong fail path that records `skipped` (0 XP) and advances to the next question.
- Updated question generation in `src/lib/challengeQuestionSelection.js` to provide 4 options per question, preserving assisted-path coverage after one wrong option is disabled.
- Manual Test Steps (executed): choose wrong option, verify retry-disabled wrong option, choose second wrong option, verify coached state and no XP/glow auto-resolution, choose wrong again, verify automatic next-question transition with skipped outcome.
- Manual Validation Result: PASS.
- Automated Validation Result: PASS (`build`, unit, integration, acceptance).

### File List
- app/challenge/page.js
- src/lib/challengeStateModel.js
- src/lib/challengeQuestionSelection.js
- tests/unit/story-3-2-two-attempt-guided-retry-and-assisted-resolution.unit.test.js
- tests/integration/story-3-2-two-attempt-guided-retry-and-assisted-resolution.integration.test.jsx
- tests/acceptance/story-3-2-two-attempt-guided-retry-and-assisted-resolution.acceptance.spec.js
- _bmad-output/implementation-artifacts/3-2-two-attempt-guided-retry-and-assisted-resolution.md
- _bmad-output/implementation-artifacts/sprint-status.yaml

### Change Log
- 2026-03-05: Story created as implementation-ready (`ready-for-dev`).
- 2026-03-05: Implemented finite retry and assisted-resolution gating with deterministic transitions and coverage; status moved to `review`.
- 2026-03-06: Updated challenge option count documentation to reflect 4 options per question.
- 2026-03-06: Revised coached assisted flow to prevent second-wrong auto completion; third wrong now skips with 0 XP.
- 2026-03-06: Stabilized acceptance retry-path validation by waiting for hydrated topic metadata before selecting answer options.
- 2026-03-06: Standardized challenge primary action label to `Next` for retry, resolve, and assisted acknowledgment states.
