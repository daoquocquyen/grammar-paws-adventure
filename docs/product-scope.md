# Product Scope

## Product Snapshot
- Project: Grammar Paws Adventure (web MVP for child grammar practice with pet progression).
- Primary user: child learner (age 11, non-native English).
- Secondary user: caregiver (progress visibility is planned, not implemented).

## MVP Goals
- Make grammar practice feel like short gameplay sessions.
- Require topic intro before challenge.
- Provide supportive explanation after each answer.
- Gate progression with a clear pass threshold (`earned_base_xp / max_base_xp >= 80%`).
- Use strict sequential unlocks: challenge `N` unlocks only after challenge `N-1` passes the XP gate (`>= 80%` of max base XP).
- Tie learning completion to pet rewards/progression.

## In Scope (MVP Boundary)
- Home player-select hub: show existing learner cards (name + hero + pet avatar) plus `New User` action.
- New user onboarding: name + hero + pet selection in a dedicated start flow.
- Returning session restore: if learner profile exists, restore name, selected pet, progress, and equipped accessories so onboarding does not need to be redone.
- Learner identity isolation: entering a different learner name starts a separate progression state (XP/progress/accessories) and must not reuse another learner's saved data.
- Topic selection map with progress/lock states.
- Topic intro with aspects and one example per aspect.
- Challenge flow with aspect-based question count formula: `clamp(aspect_count * 3, 6, 15)`.
- Right/wrong explanation after each answer.
- Pass/fail evaluation at `earned_base_xp / max_base_xp >= 80%` (`required_xp_to_pass = ceil(total_questions * 10 * 0.8)`).
- Challenge progress HUD shows `earned_xp / required_xp_to_pass` for the active run.
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

## Current Implementation Boundary (as of 2026-03-12)
- Active Next.js routes exist for:
  - Screen 1 (`/`): player-select home with existing learner cards (`name`, `hero`, `pet avatar`) and `New User` route to onboarding.
  - Screen 1B (`/onboarding`): onboarding + profile hydrate/persist from localStorage.
  - Screen 2 (`/world-map`): topic selection + save selected topic + route to intro.
  - Screen 3 (`/topic-intro`): loading/error/content states + voice controls + dynamic aspect rendering from shared topic metadata.
  - Screen 4 (`/challenge`): challenge flow shell with dynamic question selection tied to selected topic aspects.
- Legacy Stitch screen files remain in `src/ui/stitch` for migration traceability.
- Profile restore is partial (name/pet hydration exists), but full persisted state (topic progress + pet accessories) is not yet implemented.
- Not yet implemented in `src/ui/stitch`: results, rewards, pet home, evolution, dashboard.

## Assumptions
- Browser environment supports `localStorage`.
- Learner returns on the same browser/device profile for MVP persistence behavior.
- Speech synthesis support varies by browser; text-only fallback is acceptable.
- Topic definitions and aspect counts are owned by centralized in-repo metadata (`src/lib/topicCatalog.js`).

## TBD Gaps (Do Not Assume)
- Production content pipeline for question bank and copy moderation.

## Source References
- `_bmad-output/planning-artifacts/prd-mvp-grammar-paws-adventure.md`
- `_bmad-output/planning-artifacts/functional-requirements-mvp.md`
- `_bmad-output/planning-artifacts/implementation-slices-feature-and-screen-plan.md`
- `src/ui/stitch/screen1-home-start-journey.html`
- `src/ui/stitch/screen2-world-map-topic-selection.html`
- `src/ui/stitch/screen3-grammar-topic-intro.html`
- `src/ui/stitch/screen4-game-challenge.html`
- `app/page.js`
- `app/onboarding/page.js`
- `app/topic-intro/page.js`
- `app/challenge/page.js`
- `src/lib/topicCatalog.js`
