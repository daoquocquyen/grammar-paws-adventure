# Story 1.3: Persist and Restore Progress and Accessories for Returning Learner

Status: done

## Story

As a returning child learner,
I want my progress and pet accessories restored automatically,
so that I can continue next day without redoing onboarding.

## Acceptance Criteria

1. Given the learner completes valid onboarding, when Start Adventure runs, then versioned `gpa_player_progress_v1` and `gpa_pet_accessories_v1` storage entries are initialized when missing.
2. Given valid persisted returning-state payloads, when Screen 1 loads, then progress/accessory state is restored safely and does not crash the page.
3. Given malformed persisted payloads, when Screen 1 loads or Start Adventure runs, then fallback default versioned payloads are re-created.
4. Existing onboarding behavior remains intact (name required, pet required, valid navigation path unchanged).
5. `npm run build` passes.

## Tasks / Subtasks

- [x] Add versioned returning-state storage keys and default contracts (AC: 1, 3)
  - [x] Add constants for `gpa_player_progress_v1` and `gpa_pet_accessories_v1`
  - [x] Add safe default payloads with `version: 1`
- [x] Initialize and repair returning-state storage during onboarding lifecycle (AC: 1, 3, 4)
  - [x] Initialize missing keys during first load and before Start Adventure navigation
  - [x] Repair malformed payloads to safe defaults
- [x] Restore returning-state values for visible context (AC: 2)
  - [x] Restore completed-topic count and unlocked-accessory count on page load
  - [x] Render restored counts in Screen 1 milestone panel
- [x] Validate no regressions (AC: 4, 5)
  - [x] Preserve existing validation and route behavior
  - [x] Run `npm run build`

## Dev Notes

### Scope
- Implements only local persistence contract for progress/accessories in React Screen 1 path.
- Does not implement gameplay progression logic; only safe initialization and restoration for returning context.

### Architecture
- Versioned keys align with `docs/architecture.md` persistence contract.
- Fallback behavior is fail-safe for malformed storage payloads.

### Testing
- Build and manual behavior checks for onboarding and returning-state restore.

## Dev Agent Record

### Agent Model Used
GPT-5.3-Codex

### Debug Log References
- `npm run build` (pass)
- `get_errors` on modified file(s)

### Completion Notes List
- Added versioned progress/accessories storage contracts to Screen 1 React flow.
- Added safe initialization and malformed-payload recovery for returning state.
- Added visible restored-state summary in milestone panel.

### File List
- _bmad-output/implementation-artifacts/1-3-persist-and-restore-progress-and-accessories-for-returning-learner.md
- app/page.js
- _bmad-output/implementation-artifacts/sprint-status.yaml

### Change Log
- 2026-03-03: Implemented returning-state persistence/restore for progress and accessories with safe fallback.
