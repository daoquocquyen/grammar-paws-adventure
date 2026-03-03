# Coding Standards

## Scope
Rules for implementing and extending this repo during the Next.js migration period.

## Naming and File Conventions
- Screen files: `screen{n}-kebab-case.html` in `src/ui/stitch/`.
- Next.js routes: folder-based App Router paths in `app/` using clean semantic slugs (e.g., `app/world-map/page.js`).
- JS identifiers: `camelCase`.
- Storage key constants: `*StorageKey` or `*Key` (constant string in one place).
- IDs for important interactive elements must be explicit and unique.

## Folder Patterns
- `app/`: Next.js App Router pages/layout and global styles.
- `src/ui/stitch/`: working UI screen files.
- `_bmad-output/planning-artifacts/`: planning source-of-truth.
- `_bmad-output/implementation-artifacts/`: import/export handoff records.
- `docs/`: agent-facing operational context docs.

## HTML and UI Conventions
- Use semantic containers where possible: `header`, `main`, `section`, `footer`.
- Keep reusable visual tokens aligned with current Tailwind config:
  - `primary: #259df4`
  - `background-light: #f5f7f8`
  - `background-dark: #101a22`
  - `font-display: Spline Sans`
- Maintain one primary CTA per screen.
- Preserve kid-friendly, short, non-shaming copy.

## JavaScript Conventions
- Prefer `const`; use `let` only for mutable state.
- Wrap `JSON.parse` in `try/catch` and keep safe fallback behavior.
- Guard optional browser APIs before use (example: `"speechSynthesis" in window`).
- Prefer `addEventListener` over inline event handlers for behavior wiring.
- Keep small named functions for responsibilities (`hydrateProfile`, `renderTopic`, `speakTopic` pattern).
- Avoid hardcoded duplicated literals (route names, storage keys, thresholds).

## React/Next Conventions
- Use client components (`"use client"`) only when browser APIs/state/hooks are needed.
- Keep route behavior in `app/**/page.js`; avoid mixing route logic into layout files.
- Preserve existing UX copy and Tailwind tokens when porting from Stitch HTML to React.
- During migration, maintain feature parity before refactoring structure.

## Clean-Code Rules
- Business rules (pass threshold, question formula) must be centralized constants when implemented.
- No dead links between screens.
- No silent failure on critical state loads; show fallback UI state.
- Avoid `innerHTML` for untrusted content.
- Keep DOM-query constants grouped at top of script.

## Quality Checklist (PR Gate)
- [ ] Naming follows screen and JS conventions.
- [ ] New storage keys are versioned and documented.
- [ ] New parsing logic has error handling.
- [ ] Route targets exist and are tested.
- [ ] Copy remains kid-friendly and concise.
- [ ] No duplicated gameplay constants.
- [ ] No unresolved TODO comments without owner/next step.

## Commit Message Standard

Every commit message must include:
1. **Title (short message)**
2. **Details (what changed and why)**

### Required Format

```text
<type>: <short title>

Details:
- <implementation or bug-fix change 1>
- <implementation or bug-fix change 2>
- <doc/test update if applicable>
```

### Allowed Types
- `feat`: new implementation
- `fix`: bug fix
- `docs`: documentation updates
- `refactor`: internal improvement without behavior change
- `test`: test additions/updates

### Rules
- Title should be concise and specific (recommended <= 72 characters).
- Details must describe concrete changes, not generic statements.
- For implementation or bug fix commits, details must mention impacted behavior.
- If docs were updated, include that in details.

### Examples

```text
feat: persist returning learner profile state

Details:
- Save learner name and selected pet into versioned localStorage keys
- Add progress and accessory restore flow on app start
- Update scope, architecture, testing, and DoD docs for persistence feature
```

```text
fix: correct screen 3 challenge route target

Details:
- Replace broken link target with existing challenge screen file name
- Verify navigation from topic intro to challenge works in manual flow
- Update feature map and readiness notes to reflect route fix
```

## Current Known Violations / Debt
- Screen 3 CTA points to `screen4-challenge-screen.html`, but existing file is `screen4-game-challenge.html`.
- Route naming in `_bmad-output/implementation-artifacts/stitch-import-status.md` differs from working file.
- External CDN/version pinning is not formalized (TBD).

## Source References
- `src/ui/stitch/screen1-home-start-journey.html`
- `src/ui/stitch/screen2-world-map-topic-selection.html`
- `src/ui/stitch/screen3-grammar-topic-intro.html`
- `src/ui/stitch/screen4-game-challenge.html`
- `_bmad-output/implementation-artifacts/stitch-import-status.md`
