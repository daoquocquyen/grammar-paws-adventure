# Product Scope

## Product Snapshot
- Project: Grammar Paws Adventure (web MVP for child grammar practice with pet progression).
- Primary user: child learner (age 11, non-native English).
- Secondary user: caregiver (progress visibility is planned, not implemented).

## MVP Goals
- Make grammar practice feel like short gameplay sessions.
- Require topic intro before challenge.
- Provide supportive explanation after each answer.
- Gate progression with a clear pass threshold (`>= 80%`).
- Use strict sequential unlocks: challenge `N` unlocks only after challenge `N-1` is passed (`>= 80%`).
- Tie learning completion to pet rewards/progression.

## In Scope (MVP Boundary)
- Home onboarding: name + pet selection in one start flow.
- Returning session restore: if learner profile exists, restore name, selected pet, progress, and equipped accessories so onboarding does not need to be redone.
- Topic selection map with progress/lock states.
- Topic intro with aspects and one example per aspect.
- Challenge flow with aspect-based question count formula: `clamp(aspect_count * 3, 6, 15)`.
- Right/wrong explanation after each answer.
- Pass/fail evaluation at `>= 80%`.
- Sequential progression guard on world map: no level-based bypass of locked challenges.
- Reward selection (1 of 3 choices) after pass.
- Pet customization and milestone evolution.
- Progress dashboard basics.
- Local-first data persistence.
- Voice narration (intro + questions) with mute/replay and graceful fallback.

## Out of Scope (Current MVP)
- Multiplayer/social gameplay.
- Cloud sync / multi-device accounts.
- Teacher dashboard/classroom reporting.
- Dynamic AI-generated questions.
- Multiple pet species.
- Advanced/custom voice provider integrations.

## Current Implementation Boundary (as of 2026-03-02)
- Implemented as static Stitch-derived web screens:
  - Screen 1: onboarding shell + profile hydrate from localStorage.
  - Screen 2: topic select shell + save selected topic + navigate to screen 3.
  - Screen 3: topic intro with loading/error/content states + voice controls.
  - Screen 4: challenge visual shell with static example content.
- Profile restore is partial (name/pet hydration exists), but full persisted state (topic progress + pet accessories) is not yet implemented.
- Not yet implemented in `src/ui/stitch`: results, rewards, pet home, evolution, dashboard.

## Assumptions
- Browser environment supports `localStorage`.
- Learner returns on the same browser/device profile for MVP persistence behavior.
- Speech synthesis support varies by browser; text-only fallback is acceptable.
- UI screens are prototype-first and will be wired into an app scaffold later.

## TBD Gaps (Do Not Assume)
- Final frontend framework and package/tooling (`package.json` not present).
- Canonical branch/PR policy for solo workflow.
- Hosting/release target and rollout strategy.
- Production content pipeline for question bank and copy moderation.

## Source References
- `_bmad-output/planning-artifacts/prd-mvp-grammar-paws-adventure.md`
- `_bmad-output/planning-artifacts/functional-requirements-mvp.md`
- `_bmad-output/planning-artifacts/implementation-slices-feature-and-screen-plan.md`
- `src/ui/stitch/screen1-home-start-journey.html`
- `src/ui/stitch/screen2-world-map-topic-selection.html`
- `src/ui/stitch/screen3-grammar-topic-intro.html`
- `src/ui/stitch/screen4-game-challenge.html`
