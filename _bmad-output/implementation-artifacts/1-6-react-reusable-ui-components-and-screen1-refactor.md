# Story 1.6: React Reusable UI Components and Screen 1 Refactor

Status: done

## Story

As a developer,
I want Screen 1 React UI split into reusable components,
so that future screens can share consistent UI and reduce duplicated code.

## Acceptance Criteria

1. Extract reusable React components from `app/page.js` without changing existing user-visible behavior.
2. Create at minimum reusable components for: header block, pet option card, validation message, and primary CTA button.
3. Keep Story 1.1 onboarding behavior intact: name required, pet required, ARIA feedback, and valid-path route navigation.
4. Keep existing visual design/tokens intact (no redesign, no new UI features).
5. `npm run build` passes after refactor.

## Tasks / Subtasks

- [x] Create reusable component structure for Screen 1
  - [x] Add `src/components/` (or equivalent) for shared UI elements
  - [x] Implement `Header` component used by Screen 1
  - [x] Implement `PetOptionCard` component used in pet selection grid
  - [x] Implement `ValidationMessage` component for inline feedback
  - [x] Implement `PrimaryButton` component for main CTA
- [x] Refactor Screen 1 page to use new components
  - [x] Replace duplicated JSX blocks with component usage
  - [x] Preserve current state/validation/navigation behavior
- [x] Keep migration boundaries explicit
  - [x] Do not implement new product features in this story
  - [x] Do not alter Story 1.2+ behavior scope
- [x] Validate refactor
  - [x] Run `npm run build`
  - [x] Verify onboarding manual flow remains unchanged

## Dev Notes

### Context
- This is a technical refactor story to improve maintainability during Next.js migration.
- It should not change product behavior established by Story 1.1.

### Current Source
- Primary file to refactor: `app/page.js`.
- Supporting runtime files: `app/layout.js`, `app/globals.css`, Tailwind config.

### Guardrails
- Preserve UX exactly as-is for Screen 1.
- Keep styling aligned with current Tailwind tokens and class patterns.
- Prefer small, focused components with clear props.

### Testing
- No automated test harness yet; required checks:
  - `npm run build` passes
  - Name/pet validation still blocks invalid start
  - Successful path still routes to `/screen2-world-map-topic-selection`

## Dev Agent Record

### Agent Model Used
GPT-5.3-Codex

### Debug Log References
- `npm run build` (pass)
- `get_errors` on modified files

### Completion Notes List
- Added reusable Screen 1 components in `src/components` for header, pet card, validation message, and primary CTA button.
- Refactored `app/page.js` to compose extracted components while preserving onboarding validation and route behavior.
- Preserved Story 1.1 and Story 1.2 behavior boundaries (no new product feature added in this refactor).

### File List
- _bmad-output/implementation-artifacts/1-6-react-reusable-ui-components-and-screen1-refactor.md
- app/page.js
- src/components/HeaderBlock.js
- src/components/PetOptionCard.js
- src/components/ValidationMessage.js
- src/components/PrimaryButton.js
- _bmad-output/implementation-artifacts/sprint-status.yaml

### Change Log
- 2026-03-02: Story created for componentization refactor after Next.js migration bootstrap.
- 2026-03-03: Refactored Screen 1 into reusable React components and marked story complete.
- 2026-03-03: Reused `HeaderBlock` across screens 1-3 and normalized brand alignment/structure consistency.
