# Story 2.3: Guided Feedback and Explanation States

Status: done

## Story

As a learner,
I want hints before answer and explanation after answer,
so that I understand reasoning without blind guessing.

## Acceptance Criteria

1. Hero avatar shows hint-only guidance while question is unanswered, and hint does not reveal the correct option.
2. After first incorrect attempt, hero explanation states why selected option does not fit, restates what sentence needs, and asks a guiding question without revealing the answer.
3. After a correct attempt, hero explanation states why the selected answer is correct using short child-friendly reasoning.
4. After second incorrect attempt, challenge enters coached assisted mode where hero explains step-by-step reasoning, but does not auto-complete or auto-award XP.
5. If learner answers correctly in coached assisted mode, challenge requires learner acknowledgment (`Next`) before progression.
6. If learner answers incorrectly in coached assisted mode, challenge marks the question as failed (`skipped`, no XP) and advances to the next question.
7. Hero explanation appears after answer interaction with a delay between 400 and 600 milliseconds.
8. Pet avatar messages are supportive and effort-focused across ready/correct/retry/assisted states, and must not use punitive wording.
9. Primary action behavior is state-based:
   - unresolved or resolved question states: `Next`
   - assisted acknowledgment state (after coached correct): `Next`
10. Automated tests cover pre-answer hint behavior, first-wrong non-reveal explanation, coached assisted behavior, and explanation-delay behavior.

## Tasks / Subtasks

- [x] Implement challenge feedback state model (AC: 1, 2, 3, 4, 5, 6, 9)
  - [x] Add explicit answer-state phases for `ready`, `wrong_first`, `correct_first`, `correct_second`, `assisted`, and `await_acknowledge`
  - [x] Ensure action labels and enabled/disabled behavior follow phase rules
- [x] Implement hero hint/explanation renderer (AC: 1, 2, 3, 4, 5, 7)
  - [x] Render hint-only content before answer
  - [x] Render first-wrong explanation without answer reveal
  - [x] Render coached assisted explanation with step-by-step reasoning
  - [x] Apply 400-600ms explanation delay after answer input
- [x] Implement supportive pet message states (AC: 8)
  - [x] Add concise encouragement variants for ready/correct/retry/assisted
  - [x] Remove punitive terms from pet message copy paths
- [x] Add automated validation coverage (AC: 10)
  - [x] Unit tests for state transitions and explanation payload selection
  - [x] Integration tests for rendered hint/explanation and action label transitions
  - [x] Acceptance test for guided retry -> coached assisted -> fail/advance path

## Dev Notes

### Scope Guardrails
- This story covers feedback timing and message logic only.
- Performance indicators and answer micro-animations are handled in Story 2.5.
- XP scoring and streak/persistence rewards are handled in Stories 3.1 and 3.4.
- Voice replay behavior remains in Story 2.4.

### Architecture and Coding Requirements
- Keep challenge state logic centralized and deterministic.
- Ensure delayed explanation rendering does not block input handling or cause race conditions.
- Preserve local-first behavior and existing storage schema compatibility.

### Source Intelligence
- PRD source: `_bmad-output/planning-artifacts/prd-mvp-grammar-paws-adventure.md` (FR-03/FR-04).
- Epic source: `_bmad-output/planning-artifacts/epics-mvp-grammar-paws-adventure.md` (Story 2.3).
- Change policy source: `_bmad-output/planning-artifacts/sprint-change-proposal-2026-03-05.md`.
- UX source: `docs/ui-ux-design.md` (Screen 4 challenge interaction model).
- Architecture source: `docs/architecture.md` (Challenge runtime state model).

### Project Structure Notes
- Active challenge route: `app/challenge/page.js`.
- Question bank and explanation payload generation: `src/lib/challengeQuestionSelection.js`.
- Story-specific tests should follow existing naming conventions in:
  - `tests/unit/`
  - `tests/integration/`
  - `tests/acceptance/`

### References
- `docs/project-context.md`
- `docs/architecture.md`
- `docs/ui-ux-design.md`
- `docs/testing-strategy.md`
- `_bmad-output/planning-artifacts/prd-mvp-grammar-paws-adventure.md`
- `_bmad-output/planning-artifacts/epics-mvp-grammar-paws-adventure.md`
- `_bmad-output/planning-artifacts/sprint-change-proposal-2026-03-05.md`

## Dev Agent Record

### Agent Model Used
GPT-5 Codex

### Debug Log References
- `npm run dev-story:validate`
- `npm run test:integration`
- `npm run test:acceptance`

### Completion Notes List
- Implemented deterministic challenge feedback phases in `app/challenge/page.js` using `ready`, `wrong_first`, `correct_first`, `correct_second`, `assisted`, and `await_acknowledge`.
- Added centralized feedback utilities in `src/lib/challengeStateModel.js` for hero/pet messaging, action-state mapping, and explanation delay contract (`EXPLANATION_DELAY_MS=500`).
- Implemented delayed hero explanation rendering after answer selection with non-revealing first-wrong copy and assisted reveal copy.
- Implemented supportive pet messaging across ready/retry/correct/assisted states with no punitive wording and no visible phase labels.
- Manual Test Steps (executed): open `/challenge` with `gpa_selected_topic_v1=nouns`, select wrong answer, verify first wrong option disabled after explanation delay, select second wrong option, verify coached assisted state with no XP/glow auto-resolution, select wrong again, verify automatic progression to next question as skipped.
- Manual Validation Result: PASS.
- Automated Validation Result: PASS (`build`, unit, integration, acceptance).

### File List
- app/challenge/page.js
- src/lib/challengeStateModel.js
- src/lib/challengeQuestionSelection.js
- tests/unit/story-2-3-guided-feedback-and-explanation-states.unit.test.js
- tests/integration/story-2-3-guided-feedback-and-explanation-states.integration.test.jsx
- tests/acceptance/story-2-3-guided-feedback-and-explanation-states.acceptance.spec.js
- _bmad-output/implementation-artifacts/2-3-guided-feedback-and-explanation-states.md
- _bmad-output/implementation-artifacts/sprint-status.yaml

### Change Log
- 2026-03-05: Story created as implementation-ready (`ready-for-dev`) from approved sprint change proposal.
- 2026-03-05: Implemented guided feedback state machine, delayed hero explanations, supportive pet messaging, and full validation coverage; status moved to `review`.
- 2026-03-06: Updated coached assisted behavior to avoid second-wrong auto-resolution and added third-wrong skip path (0 XP).
- 2026-03-06: Senior review pass confirmed guided-feedback AC coverage remains complete after regression sweep.
- 2026-03-06: Standardized challenge primary action label to `Next` across all phases and synced test/doc expectations.
