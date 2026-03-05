# Story 3.2: Two-Attempt Guided Retry and Assisted Resolution

Status: ready-for-dev

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

- [ ] Implement attempt counter and finite flow controls (AC: 1, 6, 7)
  - [ ] Enforce max two attempts
  - [ ] Block further independent selections after second incorrect attempt
- [ ] Implement guided retry behavior (AC: 2, 3)
  - [ ] Disable previously incorrect option for retry stage
  - [ ] Render non-revealing guided explanation
- [ ] Implement assisted resolution behavior (AC: 4, 5)
  - [ ] Reveal correct answer with calm step-by-step explanation
  - [ ] Gate progression behind `I understand`
- [ ] Add automated validation coverage (AC: 8)
  - [ ] Unit tests for transition graph
  - [ ] Integration tests for retry disable/reveal/gate behavior

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
- N/A (story creation only)

### Completion Notes List
- Story created with explicit finite retry and assisted-resolution gating requirements.

### File List
- _bmad-output/implementation-artifacts/3-2-two-attempt-guided-retry-and-assisted-resolution.md

### Change Log
- 2026-03-05: Story created as implementation-ready (`ready-for-dev`).
