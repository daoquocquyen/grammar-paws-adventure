# Story 1.2: Persist Player Profile After Start Journey

Status: review

## Story

As the system,
I want to save player name and selected pet in versioned local storage,
so that the learner does not lose identity on refresh.

## Acceptance Criteria

1. Given the learner completes valid onboarding on React Screen 1 (`app/page.js`), when `Start Adventure` is clicked, then player profile is saved to `localStorage` under `gpa_player_profile_v1` before navigation.
2. Given an existing valid `gpa_player_profile_v1` payload, when Screen 1 is loaded or refreshed, then player name and selected pet are restored into UI state.
3. Persistence is versioned and backward-safe for MVP (`*_v1` key; safe parse guard and fallback behavior on malformed data).
4. Existing Story 1.1 behavior remains intact: required name, required pet, and route to `/world-map` when valid.
5. `npm run build` passes after changes.

## Tasks / Subtasks

- [x] Implement profile persistence on valid Start Adventure flow (AC: 1, 3, 4)
  - [x] Keep single source key constant (`gpa_player_profile_v1`)
  - [x] Save a versioned payload with learner name and selected pet details before route push
  - [x] Wrap `localStorage` writes in safe error handling
- [x] Hydrate onboarding state from stored profile on load (AC: 2, 3)
  - [x] Parse stored profile safely with `try/catch`
  - [x] Restore `playerName` and `selectedPetName` where possible
  - [x] Keep fail-safe behavior for malformed payloads
- [x] Preserve onboarding validation and navigation behavior from Story 1.1 (AC: 4)
  - [x] Keep required-name + required-pet validation intact
  - [x] Keep successful navigation target unchanged
- [x] Validate implementation (AC: 5)
  - [x] Run `npm run build`

## Dev Notes

### Story Context
- This story implements profile persistence for the React migration path (`app/page.js`) only.
- Scope is intentionally limited to learner identity persistence (name + selected pet).
- Progress and accessories persistence are addressed in Story 1.3+.

### Architecture and Constraints
- Versioned storage key is defined in architecture docs as `gpa_player_profile_v1`.
- Local-first persistence must be safe and non-crashing on malformed storage.
- Runtime remains browser-local with Next.js client component behavior.

### Coding and UX Guardrails
- Preserve kid-friendly copy and current visual tokens.
- Keep business flow unchanged: validate first, then persist, then navigate.
- Avoid introducing new dependencies or redesigning UI.

### Testing Requirements
- Project currently has no automated test framework.
- Required checks for this story:
  - `npm run build` succeeds.
  - Valid onboarding persists profile and navigates successfully.
  - Hard refresh restores learner identity in Screen 1 state.
  - Malformed localStorage payload fails safely without runtime crash.

### References
- Source: `_bmad-output/planning-artifacts/epics-mvp-grammar-paws-adventure.md` (Story 1.2)
- Source: `docs/architecture.md` (versioned localStorage contract)
- Source: `docs/product-scope.md` (returning session restore intent)
- Source: `docs/coding-standards.md`
- Source: `docs/testing-strategy.md`

## Dev Agent Record

### Agent Model Used
GPT-5.3-Codex

### Debug Log References
- `npm run build` (pass)
- `get_errors` on modified files
- `npx vitest run tests/unit/onboardingValidation.test.js` (pass)
- `npx vitest run tests/integration/onboarding.screen1.integration.test.jsx` (pass)
- `npm run test:acceptance` (pass)

### Completion Notes List
- Added versioned profile persistence on successful Start Adventure in `app/page.js`.
- Added safe hydration for `playerName` and `selectedPetName` from `gpa_player_profile_v1`.
- Preserved Story 1.1 validation and route behavior while adding persistence.
- Resolved code-review follow-ups: validated profile payload shape, switched avatar hydration to trusted pet catalog mapping, and synced header identity state with user edits/selections.
- Re-dev run completed: added integration coverage for persist/hydrate/malformed payload handling and acceptance coverage for profile persistence+refresh restoration.
- Stabilized acceptance selectors and integration test cleanup for deterministic CI execution.

### File List
- _bmad-output/implementation-artifacts/1-2-persist-player-profile-after-start-journey.md
- tests/integration/onboarding.screen1.integration.test.jsx
- tests/acceptance/onboarding.spec.js
- _bmad-output/implementation-artifacts/sprint-status.yaml

### Change Log
- 2026-03-03: Story file created and implemented for Epic 1 Story 1.2.
- 2026-03-03: Added profile persistence and hydration in React Screen 1 flow.
- 2026-03-03: Senior code review completed; 3 medium findings fixed and story approved.
- 2026-03-03: Reopened story for re-development run.
- 2026-03-03: Re-development complete with expanded integration and acceptance tests; story returned to review.

## Senior Developer Review (AI)

### Reviewer
- Reviewer: GPT-5.3-Codex
- Date: 2026-03-03
- Outcome: Approve

### Findings
- [MEDIUM] Profile hydration accepted unchecked value types from localStorage, allowing malformed payloads to populate UI state.
- [MEDIUM] Header avatar hydration trusted persisted `petImage` directly instead of canonical pet catalog mapping.
- [MEDIUM] Header identity display could drift from current onboarding edits/selections until save, creating UI inconsistency.

### Fixes Applied
- Added strict profile payload shape checks (`name` string, non-empty after trim) before restoring into state.
- Hydrated pet avatar and label from trusted in-memory `pets` catalog via restored `petName` lookup.
- Synced header name/pet display immediately when learner edits name or selects a pet.

### AC Revalidation Summary
- AC1: PASS
- AC2: PASS
- AC3: PASS
- AC4: PASS
- AC5: PASS
