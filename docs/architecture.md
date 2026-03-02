# Architecture

## System Overview
Repository now has a dual-runtime state:
- Legacy static prototype with Stitch-derived HTML screens and embedded JavaScript.
- New Next.js App Router scaffold for incremental React migration.

```mermaid
flowchart LR
  S1[screen1-home-start-journey.html] --> S2[screen2-world-map-topic-selection.html]
  S2 -->|set gpa_selected_topic_v1| S3[screen3-grammar-topic-intro.html]
  S3 -->|Start Challenge link| S4Path[screen4-challenge-screen.html]
  S4Path -.mismatch .-> S4Actual[screen4-game-challenge.html]
  S1 --> LS[(localStorage)]
  S2 --> LS
  S3 --> LS
  S4Actual --> LS
  S3 --> SS[speechSynthesis API]
```

## Runtime Components
- UI layer (legacy): static HTML in `src/ui/stitch/`.
- UI layer (new): Next.js App Router pages in `app/`.
- Styling (legacy): Tailwind via CDN + inline `tailwind.config`.
- Styling (new): Tailwind CSS via PostCSS build pipeline.
- State: localStorage keys:
  - `gpa_player_profile_v1`
  - `gpa_selected_topic_v1`
  - `gpa_voice_settings_v1`
  - `gpa_player_progress_v1` (planned)
  - `gpa_pet_accessories_v1` (planned)
- Voice: browser `speechSynthesis` in topic intro screen.
- Navigation (legacy): relative links and `window.location.href`.
- Navigation (new): Next.js route navigation (`next/navigation`).

## Tech Stack (Current)
| Area | Current Choice | Version Status |
|---|---|---|
| App Framework | Next.js (App Router) | `14.2.5` |
| UI Runtime | React | `18.2.0` |
| Markup | HTML5 + JSX | Active migration |
| Styling | Tailwind CSS (build-time) + Tailwind CDN (legacy) | Build stack pinned; legacy CDN remains |
| Script | React components + legacy Vanilla JavaScript | Mixed during migration |
| Fonts | Google Fonts (`Spline Sans`) | CDN/latest, exact version TBD |
| Icons | Material Symbols | CDN/latest, exact version TBD |
| Storage | Browser `localStorage` | Browser-provided |
| Voice | `SpeechSynthesisUtterance` | Browser-provided |

## Key Architectural Decisions
- Keep Stitch raw exports in `_bmad-output/implementation-artifacts/stich-export/`.
- Keep working, editable copies in `src/ui/stitch/`.
- Add Next.js scaffold at repo root (`app/`, `package.json`, Tailwind/PostCSS configs) for gradual migration.
- Migrate Screen 1 behavior first into `app/page.js` while preserving legacy source for verification.
- Use local-first persistence for MVP (no backend dependency yet).
- Persist learner return state (name, selected pet, progress, accessories) and restore it on app entry to avoid repeated onboarding.
- Keep gameplay rules defined in planning artifacts before engine wiring.

## Planned Persistence Contract (MVP)
- Player profile (`gpa_player_profile_v1`): learner display name + selected pet identity.
- Player progress (`gpa_player_progress_v1`): topic completion/pass status and latest progression markers.
- Pet accessories (`gpa_pet_accessories_v1`): unlock inventory and currently equipped accessory IDs.
- Restore behavior: app boot checks versioned keys and hydrates UI before showing onboarding defaults.
- Fallback behavior: missing/corrupt keys fail safe to first-time onboarding state without runtime crash.

## Constraints
- Framework migration is in progress: legacy static pages and new React routes coexist.
- No CI pipeline or workflow automation defined in repo.
- External CDN dependency for style/fonts/icons and image assets.
- Screen naming inconsistency exists:
  - Link target in screen 3: `screen4-challenge-screen.html`
  - Actual file: `screen4-game-challenge.html`
- Raw export folder intentionally misspelled as `stich-export` (legacy compatibility).

## Planned Architecture (From Artifacts, Not Implemented Yet)
- Vertical slices S1-S5 from implementation plan:
  - Foundation/topic intro
  - Challenge engine
  - Results/retry loop
  - Rewards/customization
  - Evolution/dashboard
- Domain entities and rules defined in functional requirements, pending code implementation.

## Migration Status
- ✅ Next.js app scaffold created (`package.json`, `app/layout.js`, `app/globals.css`, `app/page.js`).
- ✅ Screen 1 onboarding ported to React route `/` with validation + pet selection behavior.
- 🟡 Screen 2 has temporary route shell at `/screen2-world-map-topic-selection`; full behavior still legacy in `src/ui/stitch/screen2-world-map-topic-selection.html`.
- 🟡 Screens 3-4 remain legacy static HTML and are pending migration.

## Architecture TBDs
- Data/service boundary for question bank source is TBD.
- Production deployment topology is TBD.
- Error telemetry and analytics instrumentation are TBD.

## Source References
- `_bmad-output/planning-artifacts/functional-requirements-mvp.md`
- `_bmad-output/planning-artifacts/implementation-slices-feature-and-screen-plan.md`
- `_bmad-output/implementation-artifacts/stitch-import-status.md`
- `src/ui/stitch/screen1-home-start-journey.html`
- `src/ui/stitch/screen2-world-map-topic-selection.html`
- `src/ui/stitch/screen3-grammar-topic-intro.html`
- `src/ui/stitch/screen4-game-challenge.html`
- `app/layout.js`
- `app/page.js`
- `app/screen2-world-map-topic-selection/page.js`
