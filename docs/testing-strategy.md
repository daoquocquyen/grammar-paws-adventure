# Testing Strategy

## Current Baseline
- Automated test frameworks are present:
  - Unit + integration: Vitest + Testing Library (`npm run test`)
  - Acceptance (E2E): Playwright (`npm run test:acceptance` / `npm run test:e2e`)
- Baseline validation includes staged automated checks plus manual browser flow checks.

## Required Story Test Execution Order
For every developed story, execute tests in this order:
1. Implement story code.
2. Create/update unit, integration, and acceptance tests for changed behavior.
3. Print a manual test checklist in the story implementation artifact before running manual validation.
4. Include the same manual test checklist in the final dev-story user handoff message under a "Manual Test Steps" section.
5. Run `npm run dev-story:validate` (`build + unit`) and fix issues quickly.
6. Execute manual test checklist and record outcomes.
7. Run integration tests (`npm run test:integration`).
8. Run acceptance/E2E tests (`npm run test:acceptance` or `npm run test:e2e`).

### Explicit Deferral Exception
- Integration and/or acceptance tests may be deferred only when the user explicitly requests deferral.
- Any deferral must be recorded in the story artifact `Dev Agent Record -> Completion Notes` with reason and pending command.

## Dev-Story Validation Policy
- Default for `/dev-story`: complete all test levels for changed behavior (`build + unit + integration + acceptance`).
- Deferral is opt-in only via explicit user request and must be documented in the story artifact.
- Script shortcuts:
  - `npm run dev-story:validate` → `build + unit`
  - `npm run dev-story:post-manual` → `integration + e2e` (optional convenience command)

## Test Levels and Scope

### Unit
Focus on deterministic gameplay rules:
- Question count formula: `clamp(aspect_count * 3, 6, 15)`.
- Pass threshold: `score >= 80%`.
- Anti-repeat question selection over recent attempts.
- In-challenge question stem uniqueness (same prompt/sentence/correct-answer combo cannot repeat within one challenge run), even when cooldown fallback is used.
- Answer option text quality guard: no synthetic numeric suffix artifacts (e.g., `am2`, `is2`, `are2`) and no duplicate options per question.
- Voice settings read/write behavior.

### Integration
Focus on feature seams between screens and storage:
- Screen 1 profile -> localStorage (`gpa_player_profile_v1`).
- Screen 1 save flow also initializes/updates progress + accessories state (`gpa_player_progress_v1`, `gpa_pet_accessories_v1`).
- Screen 2 topic selection -> localStorage (`gpa_selected_topic_v1`) + route.
- Screen 2 default focus resolves to the latest unlocked topic card from progress state.
- Screen 2 carousel auto-scroll keeps the focused latest unlocked card visible on initial load.
- Screen 3 hydrates selected topic + renders aspects + voice controls.
- Screen 3 cancels active narration when route changes/unmount occurs.
- Screen 4 consumes profile context without crash.
- Returning session boot restores saved name/pet/progress/accessories without forcing onboarding re-entry.

### Acceptance (E2E User Flow)
Focus on user outcomes:
- First-time onboarding -> topic selection -> intro -> challenge starts.
- Returning-day flow restores prior profile/progress/accessories and allows immediate continuation.
- Fail path shows supportive retry and no dead-end (planned behavior).
- Pass path enables reward flow (planned behavior).
- Voice unsupported browser still allows gameplay flow.

## Coverage Targets
- Current targets:
  - Rule engine unit coverage: >= 80%.
  - Core flow integration coverage: 100% of mandatory transitions.
  - Acceptance coverage: 100% of MVP "happy path" + fail/retry branch.

## Test Data Policy
- Use deterministic fixtures for topics/aspects/questions.
- Keep local test data namespaced/versioned (`*_v1` keys).
- Do not use real child-identifiable data in fixtures.
- Keep copy fixtures aligned with kid-friendly tone rules.
- Track expected outputs for edge cases:
  - aspect_count: 1, 4, 8
  - score boundary: 79%, 80%, 100%

## Manual Regression Checklist (Required Before Integration/Acceptance Execution)
- [ ] `npm run build` passes for Next.js runtime.
- [ ] React route `/` loads without console-breaking errors.
- [ ] React Screen 1 validation blocks start when name or pet is missing.
- [ ] React Screen 1 navigates to `/world-map` when valid.
- [ ] All existing screen files load without console-breaking errors.
- [ ] Screen 2 `Start Topic` stores selected topic and opens screen 3.
- [ ] Screen 2 default focused card is the latest unlocked topic for the current progress state.
- [ ] Screen 2 auto-scroll reveals the default focused card when it is outside the first visible 4-card viewport.
- [ ] Screen 1 persists learner name + selected pet and survives hard refresh.
- [ ] Progress and accessory state keys restore expected UI context on next visit.
- [ ] Corrupt/missing persisted data degrades safely to first-time flow without crash.
- [ ] Screen 3 loads topic data and toggles loading/error/content states correctly.
- [ ] Voice speaker toggle (on/off) functions or degrades safely.
- [ ] Leaving Screen 3 stops any in-progress narration (no carry-over audio).
- [ ] Screen 3 `Start Challenge` routes to `/challenge` and remains visually labeled as `Start Challenge`.
- [ ] Screen 4 displays challenge UI and profile hydration safely.

## Automation TBDs
- CI execution pipeline: TBD.
- Artifact for test reports/coverage: TBD.

## Source References
- `_bmad-output/planning-artifacts/functional-requirements-mvp.md`
- `_bmad-output/planning-artifacts/prd-mvp-grammar-paws-adventure.md`
- `src/ui/stitch/screen2-world-map-topic-selection.html`
- `src/ui/stitch/screen3-grammar-topic-intro.html`
- `src/ui/stitch/screen4-game-challenge.html`
