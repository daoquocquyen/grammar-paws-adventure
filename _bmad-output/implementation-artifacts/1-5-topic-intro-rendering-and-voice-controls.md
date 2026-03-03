# Story 1.5: Topic Intro Rendering and Voice Controls

Status: done

## Story

As a learner,
I want intro content with simple voice control support,
so that I can understand the topic in a friendly way.

## Acceptance Criteria

1. Given a selected topic key from Screen 2, when intro route loads, then topic title, summary, and aspect list render from topic metadata.
2. Intro route supports loading, error, and content states for topic hydration.
3. Voice narration supports speaker on/off toggle control when browser speech synthesis is available.
4. If browser speech synthesis is unavailable, UI degrades safely to text mode without flow-breaking errors.
5. Profile header context remains hydrated from local profile data.
6. `npm run build` passes.

## Tasks / Subtasks

- [x] Implement topic intro data rendering (AC: 1, 2)
  - [x] Add in-route topic metadata map for current MVP topics
  - [x] Hydrate selected topic from `gpa_selected_topic_v1`
  - [x] Render topic summary and aspect cards
- [x] Implement voice controls and fallback behavior (AC: 3, 4)
  - [x] Detect speech synthesis support
  - [x] Add speaker on/off toggle with persisted `gpa_voice_settings_v1`
  - [x] Show text-mode fallback hint when voice is unavailable
- [x] Preserve learner identity context in intro (AC: 5)
  - [x] Hydrate name/pet/avatar header from profile storage
- [x] Validate implementation (AC: 6)
  - [x] Run `npm run build`

## Dev Notes

### Scope
- Implements Screen 3 intro rendering and voice UX for MVP route migration.
- Challenge gameplay remains out of scope for this story.

## Dev Agent Record

### Agent Model Used
GPT-5.3-Codex

### Debug Log References
- `npm run build` (pass)
- `get_errors` on modified files

### Completion Notes List
- Replaced intro scaffold with topic-aware rendering and graceful loading/error/content states.
- Added speaker on/off voice control with persisted mute preference and safe voice fallback.
- Preserved profile header context on intro screen.

### File List
- _bmad-output/implementation-artifacts/1-5-topic-intro-rendering-and-voice-controls.md
- app/screen3-grammar-topic-intro/page.js
- _bmad-output/implementation-artifacts/sprint-status.yaml

### Change Log
- 2026-03-03: Implemented topic intro rendering and voice controls with fallback behavior.
- 2026-03-03: Refactored Screen 3 visual layout to centered, larger composition and aligned header style with other screens.
- 2026-03-03: Removed temporary demo topic and simplified Screen 3 voice UI to single speaker toggle.
