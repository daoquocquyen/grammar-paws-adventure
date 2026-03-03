# UI/UX Design (Implemented Stitch Screens)

## Scope
Derived from implemented screens only:
- `src/ui/stitch/screen1-home-start-journey.html`
- `src/ui/stitch/screen2-world-map-topic-selection.html`
- `src/ui/stitch/screen3-grammar-topic-intro.html`
- `src/ui/stitch/screen4-game-challenge.html`

Planning artifacts were used only to identify intended behavior and mark gaps.

## Global Visual System

### Colors and Tokens
- Primary brand color: `#259df4` (`primary`).
- Background tokens:
  - Light: `#f5f7f8` (`background-light`)
  - Dark: `#101a22` (`background-dark`)
- Supporting colors in components:
  - Success/positive: green shades on progress and feedback.
  - Error: rose/red shades (screen 3 error state).
- High-level pattern: white card surfaces on soft gray background with bright blue CTA emphasis.

### Typography
- Primary typeface: `Spline Sans` (Google Fonts).
- Hierarchy pattern:
  - Heavy/black weight for titles and CTA labels.
  - Small uppercase tracking for metadata labels.
  - Medium body for helper copy.

### Iconography
- Material Symbols used consistently for pets, status, voice, locks, progression arrows.
- Icon + label pattern is used in many places, but not universally applied for buttons.

### Spacing and Layout
- Max-width layout containers with wide desktop gutters (`md:px-20` patterns).
- Card-first composition with rounded corners (`rounded-xl`, `rounded-[24px]`).
- Grid layouts shift from single-column mobile to multi-column desktop.

### Cards and Surfaces
- Core surfaces: white cards with subtle borders/shadows.
- Progress cards: include icon, headline, helper text, progress bar.
- Speech/feedback cards: rounded panels with gentle contrast backgrounds.

### Buttons and CTAs
- Primary CTA style: blue filled rounded/full-pill button.
- Secondary CTA style: outlined or subdued neutral button.
- Locked actions represented by muted styles + disabled affordance.

### State Patterns (Observed)
- Explicit states are best represented in screen 3:
  - `loadingState`
  - `errorState`
  - `contentState`
- Other screens mostly show static visual variants (locked/in-progress/completed), not dynamic state transitions.

## End-to-End User Journey (Screens 1-4)
1. **Home / Start Journey**: child sees game intro, name input, pet options, and start CTA.
2. **World Map / Topic Selection**: child sees topic progression cards; selected in-progress topic starts.
3. **Grammar Topic Intro**: selected topic loads, aspects/examples displayed, voice narration controls available.
4. **Game Challenge**: child answers question with progress context and supportive helper copy.

Current navigation issue:
- Screen 3 "Start Challenge" links to `./screen4-challenge-screen.html`, but existing file is `screen4-game-challenge.html`.

## Screen-Level Specs

## Screen 1: Home / Start Journey
- UX goal: simple onboarding and emotional hook before learning begins.
- Key components:
  - Branded header (title + playful subtitle).
  - Name input card.
  - Pet selection grid (6 options shown).
  - Pet preview + milestone panel.
  - Primary CTA: Start Adventure.
- Interaction behavior:
  - Current JS hydrates onboarding fields from `gpa_player_profile_v1`.
  - Pet selection and name submission behavior is mostly visual (no full save/validate flow yet).
- CTA hierarchy:
  - Primary: `Start Adventure`.
  - Secondary actions are visual only in current implementation.
- State handling:
  - No explicit loading/error/validation state in this file.

## Screen 2: World Map / Topic Selection
- UX goal: orient child in progression and guide to next actionable topic.
- Key components:
  - Two-lane road-path topic cards with completed/in-progress/locked styles.
  - Progress indicators and lock cues.
  - Decorative curved path connectors to imply journey.
  - Dual icon system per topic (status icon + pet-dependent topic icon).
- Interaction behavior:
  - `Start Topic`/`Review` saves selected topic key to `gpa_selected_topic_v1`.
  - Routes to screen 3.
  - Header profile hydrates from stored player profile.
  - Header level badge hydrates from `gpa_player_progress_v1` and renders grouped title bands (e.g., level 1-3 Explorer).
  - Topic ordering is easy-to-hard.
  - Topic status is computed dynamically from learner history + level (`done`, `ongoing`, `locked`).
  - Locked topics are non-interactive and cannot expand.
- CTA hierarchy:
  - Primary: `Start Topic` on ongoing cards.
  - Secondary: `Review` on done cards.
- State handling:
  - Visual state variants (completed/in-progress/locked) are fully dynamic based on persisted progress data.

## Screen 3: Grammar Topic Intro
- UX goal: teach topic essentials before challenge and provide confidence.
- Key components:
  - Topic title/summary card.
  - Aspect list with examples.
  - Pet speech bubble and avatar.
  - Voice controls: replay + mute toggle.
  - CTA pair: Start Challenge / Back to Map.
- Interaction behavior:
  - Reads selected topic key from localStorage.
  - Renders topic content from in-file topic map.
  - Auto-plays speech when available and not muted.
  - Saves voice setting to `gpa_voice_settings_v1`.
- CTA hierarchy:
  - Primary: `Start Challenge`.
  - Secondary: `Back to Map`.
- State handling:
  - Explicit loading, error, and content states are implemented.

## Screen 4: Game Challenge
- UX goal: present one clear question with immediate encouragement.
- Key components:
  - Progress header (question index + percent complete).
  - Question prompt with voice replay icon.
  - Answer option buttons.
  - Sidebar helper panel and feedback card.
  - Mobile sticky feedback/next panel.
- Interaction behavior:
  - Profile hydration from `gpa_player_profile_v1`.
  - Challenge logic (selection, scoring, next-question updates) is not implemented yet.
- CTA hierarchy:
  - Primary: `Next Question` (desktop and mobile variants).
  - Secondary: answer option selection.
- State handling:
  - Feedback panel is static example content; no dynamic correct/incorrect transition logic.

## Responsive Behavior
- Mobile:
  - Single-column card stacking.
  - Reduced spacing and smaller copy in several areas.
  - Screen 4 adds a fixed bottom feedback panel for quick continuation.
- Desktop:
  - Multi-column layouts and wider hero/header spacing.
  - Sidebar helper areas become persistent (screen 4).
- Observed risk:
  - Some touch targets and text sizes are compact in dense cards and may be challenging for younger users.

## Accessibility Observations and Improvements

### Observations
- Positive:
  - Consistent heading hierarchy and readable color contrast in primary areas.
  - Icons often paired with text labels.
  - Clear large primary CTAs on main actions.
- Gaps:
  - Duplicate Material Symbols stylesheet links in several screens.
  - Some `img` tags use empty `alt` and rely on `data-alt`.
  - Focus-visible states are not consistently explicit.
  - Form validation messaging for onboarding is absent.
  - Some helper text is very small (`text-[10px]`, `text-[11px]`).

### Concrete Improvements
- [ ] Add meaningful `alt` text to all informative images; keep decorative images empty `alt=""`.
- [ ] Add explicit `:focus-visible` styling for all interactive controls.
- [ ] Implement keyboard-operable pet selection and visible selected state semantics (`aria-pressed`).
- [ ] Add onboarding validation messages with ARIA-live region.
- [ ] Increase minimum helper text to more readable size on mobile.
- [ ] Validate color contrast in all muted/disabled text combinations.

## Voice, Tone, and Learning Feedback Style
- Existing style: warm, playful, encouraging ("meow-velous" coaching).
- Effective pattern: short confidence-boosting explanation near action buttons.
- Rule for future copy:
  - Keep feedback concise (1-2 sentences).
  - Explain why answer is right/wrong without shame language.
  - Use pet companion voice as support, not distraction.

## Open UX Gaps and Next Design Decisions
- [ ] Resolve screen 3 -> screen 4 link/filename mismatch.
- [ ] Define and implement results/retry/reward screens (not in current `src/ui/stitch`).
- [ ] Finalize onboarding validation UX (name required, pet required).
- [ ] Decide final challenge answer interaction model (single submit vs auto-check).
- [ ] Define consistent loading/error/empty states for all existing and planned screens.
- [ ] Confirm accessibility baseline for child audience (tap sizes, reading level, focus flow).

## Final Source Screens (Exact Paths)
- `src/ui/stitch/screen1-home-start-journey.html`
- `src/ui/stitch/screen2-world-map-topic-selection.html`
- `src/ui/stitch/screen3-grammar-topic-intro.html`
- `src/ui/stitch/screen4-game-challenge.html`
