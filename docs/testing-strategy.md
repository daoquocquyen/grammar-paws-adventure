# Testing Strategy

## Current Baseline
- No automated test framework is present in repository (`package.json`/test runner missing).
- Current validation is manual browser flow verification on static screens.

## Test Levels and Scope

### Unit (Planned, After Logic Extraction)
Focus on deterministic gameplay rules:
- Question count formula: `clamp(aspect_count * 3, 6, 15)`.
- Pass threshold: `score >= 80%`.
- Anti-repeat question selection over recent attempts.
- Voice settings read/write behavior.

### Integration (Manual Now, Automated Later)
Focus on feature seams between screens and storage:
- Screen 1 profile -> localStorage (`gpa_player_profile_v1`).
- Screen 1 save flow also initializes/updates progress + accessories state (`gpa_player_progress_v1`, `gpa_pet_accessories_v1`).
- Screen 2 topic selection -> localStorage (`gpa_selected_topic_v1`) + route.
- Screen 3 hydrates selected topic + renders aspects + voice controls.
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
- Current: `TBD` (no automation harness yet).
- Target after app scaffold:
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

## Manual Regression Checklist (Current Required Gate)
- [ ] All existing screen files load without console-breaking errors.
- [ ] Screen 2 `Start Topic` stores selected topic and opens screen 3.
- [ ] Screen 1 persists learner name + selected pet and survives hard refresh.
- [ ] Progress and accessory state keys restore expected UI context on next visit.
- [ ] Corrupt/missing persisted data degrades safely to first-time flow without crash.
- [ ] Screen 3 loads topic data and toggles loading/error/content states correctly.
- [ ] Voice mute/replay controls function or degrade safely.
- [ ] Screen 3 "Start Challenge" link resolves to an existing file (currently failing; fix required).
- [ ] Screen 4 displays challenge UI and profile hydration safely.

## Automation TBDs
- Unit test framework choice: TBD.
- Integration/E2E framework choice: TBD.
- CI execution pipeline: TBD.
- Artifact for test reports/coverage: TBD.

## Source References
- `_bmad-output/planning-artifacts/functional-requirements-mvp.md`
- `_bmad-output/planning-artifacts/prd-mvp-grammar-paws-adventure.md`
- `src/ui/stitch/screen2-world-map-topic-selection.html`
- `src/ui/stitch/screen3-grammar-topic-intro.html`
- `src/ui/stitch/screen4-game-challenge.html`
