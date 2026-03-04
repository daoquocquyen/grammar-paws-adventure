# Story 1.7: Onboarding 3D Hero Avatar Selection (6 Avatars) and Validation

Status: done

## Story

As a child learner,
I want to choose my 3D hero avatar from 6 kid avatars (3 male and 3 female) and also choose my pet avatar,
so that my learning journey feels personal from the first screen.

## Acceptance Criteria

1. Given the learner is on Screen 1, the onboarding UI shows exactly 6 selectable 3D hero avatars with balanced presentation (3 male, 3 female).
2. Given the learner clicks `Start Adventure` without selecting a hero avatar, inline validation is shown and navigation is blocked.
3. Given the learner clicks `Start Adventure` without selecting a pet avatar, inline validation is shown and navigation is blocked.
4. Given learner name + hero avatar + pet avatar are selected, profile is persisted and app routes to `/world-map`.
5. Persisted profile includes hero avatar metadata and keeps compatibility with existing profile consumers.
6. Selection controls remain keyboard accessible with visible selected state and ARIA-live validation feedback.

## Tasks / Subtasks

- [x] Update onboarding validation logic to require hero avatar selection
- [x] Add 3D hero avatar selection UI (6 options) to Screen 1
- [x] Persist selected hero avatar in `gpa_player_profile_v1`
- [x] Hydrate previously selected hero avatar on return to Screen 1
- [x] Extend unit, integration, and acceptance tests for hero-required flow
- [x] Mark sprint status and story record after verification

## Dev Notes

### Scope Guardrails
- Keep existing Screen 1 design language and components.
- Keep route and storage keys unchanged (`gpa_player_profile_v1`, `/world-map`).
- Additive onboarding change only; do not expand beyond Story 1.7.

### Testing Targets
- `npm run test:unit`
- `npm run test:integration`
- `npm run test:acceptance`

## Dev Agent Record

### Agent Model Used
GPT-5.3-Codex

### File List
- _bmad-output/implementation-artifacts/1-7-onboarding-hero-avatar-selection-6-avatars-and-validation.md
- app/page.js
- src/lib/onboardingValidation.js
- tests/unit/onboardingValidation.test.js
- tests/integration/onboarding.screen1.integration.test.jsx
- tests/acceptance/onboarding.spec.js
- _bmad-output/implementation-artifacts/sprint-status.yaml

### Change Log
- 2026-03-04: Story 1.7 created and implementation started.
- 2026-03-04: Implemented 3D hero avatar selection (6 avatars), added hero-required validation, and persisted hero metadata in profile payload.
- 2026-03-04: Verified with `npm run test:unit`, `npm run test:integration`, and `npm run test:acceptance` (all passing).
- 2026-03-04: Corrected hero catalog to true 3D avatar assets with explicit 3 male + 3 female kid hero lineup.
- 2026-03-04: Refined Screen 1 preview panel to “Your Grammar Hero and Companion” with larger hero/pet avatars, supportive hero/pet-specific dialog bubbles (rounded curl tails + shadow), removed mood/milestone UI, and added a centered dashed connector badge (“Ready for Grammar Mission!”).
