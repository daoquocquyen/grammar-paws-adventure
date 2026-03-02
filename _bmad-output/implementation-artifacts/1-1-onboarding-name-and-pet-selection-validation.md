# Story 1.1: Onboarding Name and Pet Selection Validation

Status: done

## Story

As a child learner,
I want to enter my name and pick a pet,
so that I can start my learning journey with my own companion.

## Acceptance Criteria

1. Given the learner is on `screen1-home-start-journey.html`, when the learner clicks `Start Adventure` without entering a name, then an inline validation message is shown and navigation is blocked.
2. Given the learner is on `screen1-home-start-journey.html`, when the learner clicks `Start Adventure` without selecting a pet, then an inline validation message is shown and navigation is blocked.
3. Given name and pet are both selected, when the learner clicks `Start Adventure`, then the app navigates to `screen2-world-map-topic-selection.html`.
4. Validation and interaction states are keyboard-accessible (focusable pet choices, visible selected state, ARIA-live validation feedback).
5. Copy for validation and onboarding remains kid-friendly, concise, and non-shaming.

## Tasks / Subtasks

- [x] Build onboarding form interaction and validation states (AC: 1, 2, 4, 5)
  - [x] Add explicit IDs/hooks for name input, pet options, start button, and validation container
  - [x] Implement name required validation (trimmed non-empty)
  - [x] Implement pet selection required validation
  - [x] Implement keyboard-operable pet selection and visible selected state (`aria-pressed`)
  - [x] Add ARIA-live validation messaging
- [x] Implement Start Adventure route gating (AC: 1, 2, 3)
  - [x] Block navigation when invalid and focus first invalid control
  - [x] Navigate to `./screen2-world-map-topic-selection.html` when valid
- [x] Keep scope bounded to Story 1.1 (AC: 5)
  - [x] Do not introduce profile persistence behavior from Story 1.2
  - [x] Keep current visual design/tokens and existing layout structure
- [x] Validate behavior manually and record evidence (AC: 1, 2, 3, 4, 5)
  - [x] Execute manual checks for valid/invalid paths and keyboard flow
  - [x] Verify no runtime errors in browser console during onboarding interactions

## Dev Notes

### Story Context
- This story covers onboarding interaction validation and routing only.
- Persistence of profile state is handled in Story 1.2 and should not be introduced here.

### Architecture and Constraints
- Runtime is static HTML + in-page JavaScript in `src/ui/stitch/`.
- Keep implementation in `src/ui/stitch/screen1-home-start-journey.html`.
- No build pipeline or automated test framework is currently configured.

### UX and Accessibility Requirements
- Follow existing screen visual system and Tailwind tokens already in the file.
- Add explicit and visible validation states for missing name/pet.
- Ensure keyboard-operable pet selection and semantic selected state (`aria-pressed`).
- Provide validation feedback through an ARIA-live region.
- Keep feedback copy warm, short, and kid-friendly.

### Coding Standards Guardrails
- Use `const` where possible and small named functions.
- Guard parsing/API usage with safe fallbacks.
- Avoid introducing duplicated hardcoded literals.
- Preserve current screen structure; apply focused changes only.

### Testing Requirements
- Manual validation is the current required gate.
- Minimum checks:
  - Empty name + no pet blocks start and displays guidance.
  - Name only blocks start with pet guidance.
  - Pet only blocks start with name guidance.
  - Valid name + pet navigates to screen 2.
  - Keyboard can choose pet and trigger start.
  - No console-breaking runtime errors.

### References
- Source: `_bmad-output/planning-artifacts/epics-mvp-grammar-paws-adventure.md` (Story 1.1)
- Source: `_bmad-output/planning-artifacts/functional-requirements-mvp.md` (SR-00)
- Source: `docs/ui-ux-design.md` (Screen 1 and accessibility improvements)
- Source: `docs/coding-standards.md`
- Source: `docs/testing-strategy.md`
- Source: `docs/definition-of-done.md`

## Dev Agent Record

### Agent Model Used
GPT-5.3-Codex

### Debug Log References
- `get_errors` run on modified files (no diagnostics)
- Route target existence check: `src/ui/stitch/screen2-world-map-topic-selection.html` confirmed

### Completion Notes List
- Implemented Story 1.1 validation and route gating in `screen1-home-start-journey.html`.
- Added required-name and required-pet validation with kid-friendly copy and blocked navigation when invalid.
- Added keyboard-accessible pet selection with `aria-pressed` state and ARIA-live feedback for validation.
- Preserved Story 1.1 scope by not introducing profile persistence behavior (reserved for Story 1.2).
- Addressed code-review findings: removed duplicate stylesheet include, added `aria-invalid` updates for name validation, and added Enter-key submit behavior from name input.

### File List
- _bmad-output/implementation-artifacts/1-1-onboarding-name-and-pet-selection-validation.md
- src/ui/stitch/screen1-home-start-journey.html
- _bmad-output/implementation-artifacts/sprint-status.yaml

### Change Log
- 2026-03-02: Story file created from Epic 1 Story 1.1 with implementation guardrails and acceptance criteria.
- 2026-03-02: Implemented onboarding validation, accessible pet selection state, and valid-path navigation to world map.
- 2026-03-02: Senior code review completed; 3 medium findings fixed and story approved.

## Senior Developer Review (AI)

### Reviewer
- Reviewer: GPT-5.3-Codex
- Date: 2026-03-02
- Outcome: Approve

### Findings
- [MEDIUM] Duplicate Material Symbols stylesheet loaded twice in `src/ui/stitch/screen1-home-start-journey.html` (unnecessary network request and maintenance drift risk).
- [MEDIUM] Name validation did not expose invalid semantic state via `aria-invalid` on the input control.
- [MEDIUM] Name field lacked Enter-key submission path, reducing expected keyboard submit flow.

### Fixes Applied
- Removed duplicate Material Symbols `<link>` include in `src/ui/stitch/screen1-home-start-journey.html`.
- Added `aria-invalid` toggling alongside visible name validation state.
- Added Enter-key handler on name input that runs the same Start Adventure validation and routing logic as button click.

### AC Revalidation Summary
- AC1: PASS
- AC2: PASS
- AC3: PASS
- AC4: PASS
- AC5: PASS
