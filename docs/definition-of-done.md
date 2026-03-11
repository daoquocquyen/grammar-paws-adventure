# Definition of Done

## Story-Level DoD (S1-S5)

### S1: Foundation + Topic Intro
- [ ] Child can enter name, choose one hero avatar and one pet avatar, and start journey in one flow.
- [ ] Name + selected pet are persisted and restored on next visit without requiring re-entry.
- [ ] Returning session can continue from saved progress context without onboarding reset.
- [ ] Topic selection always routes to topic intro first.
- [ ] Topic intro renders aspects + one example per aspect.
- [ ] Voice replay/mute works, or fallback message appears if unsupported.
- [ ] No blocking console/runtime errors in S1 flow.

### S2: Challenge Engine + Explanations
- [ ] Question count uses `clamp(aspect_count * 3, 6, 15)`.
- [ ] Question selection supports variation and recent-question cooldown.
- [ ] A single challenge run does not contain duplicate question stems (same prompt/sentence/correct-answer combo).
- [ ] Every answer shows correctness + kid-friendly explanation.
- [ ] Replay voice for current question is available or safely disabled.
- [ ] Retry of same topic produces different set unless pool exhausted.

### S3: Results + Retry Loop
- [ ] Score calculation is correct for boundary cases.
- [ ] Pass only when score `>= 80%`.
- [ ] Fail path shows supportive retry and focus aspects.
- [ ] Pass path progresses to reward selection.
- [ ] No dead-end states in fail or pass branches.

### S4: Rewards + Pet Customization
- [ ] Exactly 3 reward options shown after pass.
- [ ] Selecting one reward persists unlock state.
- [ ] Equip/unequip behavior updates pet view immediately.
- [ ] Equipped and unlocked state survives refresh.
- [ ] Equipped and unlocked accessory state is restored on next-day return.
- [ ] Invalid/duplicate reward claim is prevented.

### S5: Evolution + Dashboard
- [ ] Evolution triggers once per milestone crossing (default every 2 topics).
- [ ] Evolution screen shows milestone context and new stage.
- [ ] Dashboard shows completion, attempts, pass trend, progress status.
- [ ] Child/caregiver summaries remain clear and supportive.
- [ ] Dashboard metrics are consistent with persisted progress.

## Feature-Level DoD (Applies to Every Feature)
- [ ] Requirements traced to source artifact (PRD/FR/slice).
- [ ] UI behavior documented in `docs/feature-file-map.md` and relevant screen files.
- [ ] Security baseline checklist completed.
- [ ] Required GitHub checks pass on PR (`CI / build-and-unit`, `Security / dependency-review`).
- [ ] Unit, integration, and acceptance tests are created/updated for changed behavior.
- [ ] Manual test steps are printed in the story implementation artifact before manual validation.
- [ ] Unit tests pass before manual testing begins.
- [ ] Manual testing checklist passes before running integration and acceptance tests.
- [ ] Integration and acceptance tests pass after manual validation.
- [ ] If integration/acceptance tests are deferred, explicit user approval and pending commands are documented in the story artifact.
- [ ] Accessibility basics checked (focus visibility, labels, contrast, tap size).
- [ ] Route and storage key changes are backward-safe or migration-documented.
- [ ] Copy follows kid-friendly, non-shaming tone.
- [ ] Any unknowns are marked as `TBD` with next action.

## Documentation Done Criteria
- [ ] Updated docs in `docs/` for behavior or scope changes.
- [ ] Commit message follows standard: short title + `Details:` section with implementation/bug-fix changes.
- [ ] Source-of-truth references included.
- [ ] No stale file/path references.
- [ ] Known gaps recorded in a dedicated "TBD" section.

## Release-Ready Gate
- [ ] All applicable story-level DoD boxes are complete.
- [ ] No critical route mismatches remain.
- [ ] Manual end-to-end smoke path passes.
- [ ] Required PR checks are green and merged to protected `main`.
- [ ] Production deployment health is verified in Vercel after merge.
- [ ] Open risks are explicitly accepted or resolved.

## Source References
- `_bmad-output/planning-artifacts/implementation-slices-feature-and-screen-plan.md`
- `_bmad-output/planning-artifacts/functional-requirements-mvp.md`
- `_bmad-output/planning-artifacts/prd-mvp-grammar-paws-adventure.md`
